package service

import (
	"crypto/md5"
	"encoding/hex"
	"fmt"
	dao "users-api/src/dao"
	domain "users-api/src/domain"
	errores "users-api/src/utils"
)

type Repository interface {
	GetUserById(id int64) (dao.User, error)
	CreateUser(registro dao.User) (int64, error)
	GetUserByEmail(email string) (dao.User, error)
}

type Tokenizer interface {
	GenerateToken(username string, userID int64) (string, error)
}

type Service struct {
	mainRepository      Repository
	cacheRepository     Repository
	memcachedRepository Repository
	tokenizer           Tokenizer
}

func NewService(mainRepository, cacheRepository, memcachedRepository Repository, tokenizer Tokenizer) Service {
	return Service{
		mainRepository:      mainRepository,
		cacheRepository:     cacheRepository,
		memcachedRepository: memcachedRepository,
		tokenizer:           tokenizer,
	}
}

func (service Service) GetUserById(id int64) (domain.User, error) {
	// service -> cache -> memcache -> mysql
	user, err := service.cacheRepository.GetUserById(id)
	if err != nil {
		fmt.Println(fmt.Sprintf("warning: error getting user from cache repository: %s", err.Error()))

		user, err = service.memcachedRepository.GetUserById(id)
		if err != nil {
			fmt.Println(fmt.Sprintf("warning: error getting user from memcached repository: %s", err.Error()))

			user, err = service.mainRepository.GetUserById(id)
			if err != nil {
				// Si el usuario no se encuentra en ninguno de los repositorios, devolver un error
				return domain.User{}, errores.NewBadRequestApiError("user not found")
			}

			if _, err := service.cacheRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in cache repository: %s", err.Error()))
			}
			if _, err := service.memcachedRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in memcached repository: %s", err.Error()))
			}
		} else {
			if _, err := service.cacheRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in cache repository: %s", err.Error()))
			}
		}
	}

	// Verified if user exist
	if user.Id == 0 {
		return domain.User{}, errores.NewBadRequestApiError("user not found")
	}

	userDto := domain.User{
		Id:       user.Id,
		Name:     user.Name,
		LastName: user.LastName,
		Dni:      user.Dni,
		Email:    user.Email,
		Password: user.Password,
		Role:     user.Role,
	}

	return userDto, nil
}

// function for login
func (service Service) Login(email string, password string) (domain.LoginResponse, error) {
	passwordHash := Hash(password)

	// Same patron as GetUserById
	user, err := service.cacheRepository.GetUserByEmail(email)
	if err != nil {
		fmt.Println(fmt.Sprintf("warning: error getting user from cache repository: %s", err.Error()))

		user, err = service.memcachedRepository.GetUserByEmail(email)
		if err != nil {
			fmt.Println(fmt.Sprintf("warning: error getting user from memcached repository: %s", err.Error()))

			user, err = service.mainRepository.GetUserByEmail(email)
			if err != nil {
				return domain.LoginResponse{}, fmt.Errorf("error getting user by email from main repository: %w", err)
			}

			if _, err := service.cacheRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in cache repository: %s", err.Error()))
			}

			if _, err := service.memcachedRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in memcached repository: %s", err.Error()))
			}
		} else {
			fmt.Println("Guardando en cache local", user)
			if _, err := service.cacheRepository.CreateUser(user); err != nil {
				fmt.Println(fmt.Sprintf("warning: error caching user in cache repository: %s", err.Error()))
			}
		}
	} else {
		fmt.Println("User found in cache", user)
	}

	if user.Password != passwordHash {
		return domain.LoginResponse{}, fmt.Errorf("invalid credentials")
	}

	token, err := service.tokenizer.GenerateToken(user.Email, int64(user.Id))
	if err != nil {
		return domain.LoginResponse{}, fmt.Errorf("error generating token: %w", err)
	}

	return domain.LoginResponse{
		Id:    user.Id,
		Token: token,
		Role:  user.Role,
	}, nil
}

func Hash(input string) string {
	hash := md5.Sum([]byte(input))
	return hex.EncodeToString(hash[:])
}

func (service Service) CreateUser(registro domain.User) (int64, error) {
	// Hashear la contraseña
	passwordHash := Hash(registro.Password)

	// Create new user en DB
	newUser := dao.User{
		Password: passwordHash,
		Name:     registro.Name,
		LastName: registro.LastName,
		Dni:      registro.Dni,
		Email:    registro.Email,
		Role:     registro.Role,
	}

	// create a user in the principal repository
	id, err := service.mainRepository.CreateUser(newUser)
	if err != nil {
		return 0, errores.NewInternalServerApiError("error creating user", err)
	}

	newUser.Id = id

	if _, err := service.cacheRepository.CreateUser(newUser); err != nil {
		fmt.Println(fmt.Sprintf("warning: error caching new user: %s", err.Error()))
	}

	if _, err := service.memcachedRepository.CreateUser(newUser); err != nil {
		fmt.Println(fmt.Sprintf("warning: error saving new user in memcached: %s", err.Error()))
	}

	return id, nil
}
