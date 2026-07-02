package service

import (
	domain "reservations-api/src/domain"
	errores "reservations-api/src/utils"
)

type Repository interface {
	InsertReservation(r domain.Reservation) (domain.Reservation, error)
	GetReservationById(id int) (domain.Reservation, error)
	GetReservations() ([]domain.Reservation, error)
	GetReservationsByUser(userId int) ([]domain.Reservation, error)
	UpdateReservation(id int, r domain.Reservation) (domain.Reservation, error)
	DeleteReservation(id int) error
}

type Service struct {
	repo Repository
}

func NewService(repo Repository) Service {
	return Service{repo: repo}
}

func (service Service) InsertReservation(r domain.Reservation) (domain.Reservation, error) {
	if err := validate(r); err != nil {
		return domain.Reservation{}, err
	}

	created, err := service.repo.InsertReservation(r)
	if err != nil {
		return domain.Reservation{}, errores.NewInternalServerApiError("error creating reservation", err)
	}
	return created, nil
}

func (service Service) GetReservationById(id int) (domain.Reservation, error) {
	reservation, err := service.repo.GetReservationById(id)
	if err != nil {
		return domain.Reservation{}, errores.NewNotFoundApiError("reservation not found")
	}
	return reservation, nil
}

func (service Service) GetReservations() ([]domain.Reservation, error) {
	reservations, err := service.repo.GetReservations()
	if err != nil {
		return nil, errores.NewInternalServerApiError("error fetching reservations", err)
	}
	return reservations, nil
}

func (service Service) GetReservationsByUser(userId int) ([]domain.Reservation, error) {
	reservations, err := service.repo.GetReservationsByUser(userId)
	if err != nil {
		return nil, errores.NewInternalServerApiError("error fetching reservations", err)
	}
	return reservations, nil
}

func (service Service) UpdateReservation(id int, r domain.Reservation) (domain.Reservation, error) {
	if err := validate(r); err != nil {
		return domain.Reservation{}, err
	}

	updated, err := service.repo.UpdateReservation(id, r)
	if err != nil {
		return domain.Reservation{}, errores.NewNotFoundApiError("reservation not found")
	}
	return updated, nil
}

func (service Service) DeleteReservation(id int) error {
	if err := service.repo.DeleteReservation(id); err != nil {
		return errores.NewNotFoundApiError("reservation not found")
	}
	return nil
}

func validate(r domain.Reservation) error {
	if r.StartDate == "" || r.EndDate == "" {
		return errores.NewBadRequestApiError("start_date and end_date are required")
	}
	if r.HotelId == "" {
		return errores.NewBadRequestApiError("hotel_id is required")
	}
	if r.UserId <= 0 {
		return errores.NewBadRequestApiError("user_id is required")
	}
	if r.Amount < 0 {
		return errores.NewBadRequestApiError("amount cannot be negative")
	}
	return nil
}
