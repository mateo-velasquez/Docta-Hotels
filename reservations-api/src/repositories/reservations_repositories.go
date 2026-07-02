package repositories_reservations

import (
	"errors"
	"fmt"
	"log"

	"gorm.io/driver/mysql"
	"gorm.io/gorm"

	dao "reservations-api/src/dao"
	domain "reservations-api/src/domain"
)

type MySQLConfig struct {
	Host     string
	Port     string
	Database string
	Username string
	Password string
}

type MySQL struct {
	db *gorm.DB
}

func NewMySQL(config MySQLConfig) MySQL {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Local", config.Username, config.Password, config.Host, config.Port, config.Database)

	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to MySQL: %s", err.Error())
	}

	if err := db.AutoMigrate(&dao.Reservation{}); err != nil {
		log.Fatalf("error running AutoMigrate: %s", err.Error())
	}

	return MySQL{db: db}
}

func toDomain(r dao.Reservation) domain.Reservation {
	return domain.Reservation{
		Id:        r.Id,
		StartDate: r.StartDate,
		EndDate:   r.EndDate,
		UserId:    r.UserId,
		HotelId:   r.HotelId,
		Amount:    r.Amount,
	}
}

func toDAO(r domain.Reservation) dao.Reservation {
	return dao.Reservation{
		Id:        r.Id,
		StartDate: r.StartDate,
		EndDate:   r.EndDate,
		UserId:    r.UserId,
		HotelId:   r.HotelId,
		Amount:    r.Amount,
	}
}

func (repository MySQL) InsertReservation(r domain.Reservation) (domain.Reservation, error) {
	record := toDAO(r)
	record.Id = 0

	if err := repository.db.Create(&record).Error; err != nil {
		return domain.Reservation{}, fmt.Errorf("error creating reservation: %w", err)
	}
	return toDomain(record), nil
}

func (repository MySQL) GetReservationById(id int) (domain.Reservation, error) {
	var record dao.Reservation
	if err := repository.db.First(&record, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Reservation{}, fmt.Errorf("reservation not found")
		}
		return domain.Reservation{}, fmt.Errorf("error fetching reservation: %w", err)
	}
	return toDomain(record), nil
}

func (repository MySQL) GetReservations() ([]domain.Reservation, error) {
	var records []dao.Reservation
	if err := repository.db.Find(&records).Error; err != nil {
		return nil, fmt.Errorf("error fetching reservations: %w", err)
	}

	result := make([]domain.Reservation, 0, len(records))
	for _, record := range records {
		result = append(result, toDomain(record))
	}
	return result, nil
}

func (repository MySQL) GetReservationsByUser(userId int) ([]domain.Reservation, error) {
	var records []dao.Reservation
	if err := repository.db.Where("user_id = ?", userId).Find(&records).Error; err != nil {
		return nil, fmt.Errorf("error fetching reservations: %w", err)
	}

	result := make([]domain.Reservation, 0, len(records))
	for _, record := range records {
		result = append(result, toDomain(record))
	}
	return result, nil
}

func (repository MySQL) UpdateReservation(id int, r domain.Reservation) (domain.Reservation, error) {
	var existing dao.Reservation
	if err := repository.db.First(&existing, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return domain.Reservation{}, fmt.Errorf("reservation not found")
		}
		return domain.Reservation{}, fmt.Errorf("error fetching reservation: %w", err)
	}

	record := toDAO(r)
	record.Id = existing.Id

	if err := repository.db.Save(&record).Error; err != nil {
		return domain.Reservation{}, fmt.Errorf("error updating reservation: %w", err)
	}
	return toDomain(record), nil
}

func (repository MySQL) DeleteReservation(id int) error {
	result := repository.db.Delete(&dao.Reservation{}, id)
	if result.Error != nil {
		return fmt.Errorf("error deleting reservation: %w", result.Error)
	}
	if result.RowsAffected == 0 {
		return fmt.Errorf("reservation not found")
	}
	return nil
}
