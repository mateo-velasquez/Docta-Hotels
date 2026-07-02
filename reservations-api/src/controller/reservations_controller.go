package controller

import (
	"net/http"
	"strconv"

	domain "reservations-api/src/domain"
	errores "reservations-api/src/utils"

	"github.com/gin-gonic/gin"
)

type Service interface {
	InsertReservation(r domain.Reservation) (domain.Reservation, error)
	GetReservationById(id int) (domain.Reservation, error)
	GetReservations() ([]domain.Reservation, error)
	GetReservationsByUser(userId int) ([]domain.Reservation, error)
	UpdateReservation(id int, r domain.Reservation) (domain.Reservation, error)
	DeleteReservation(id int) error
}

type Controller struct {
	service Service
}

func NewController(service Service) Controller {
	return Controller{service: service}
}

func respondError(c *gin.Context, err error) {
	if apiErr, ok := err.(errores.ApiError); ok {
		c.JSON(apiErr.Status(), gin.H{"error": apiErr.Message()})
		return
	}
	c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
}

func (controller Controller) InsertReservation(c *gin.Context) {
	var reservation domain.Reservation
	if err := c.BindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	created, err := controller.service.InsertReservation(reservation)
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (controller Controller) GetReservationById(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid reservation id"})
		return
	}

	reservation, err := controller.service.GetReservationById(id)
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, reservation)
}

func (controller Controller) GetReservations(c *gin.Context) {
	reservations, err := controller.service.GetReservations()
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, reservations)
}

func (controller Controller) GetReservationsByUser(c *gin.Context) {
	userId, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid user id"})
		return
	}

	reservations, err := controller.service.GetReservationsByUser(userId)
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, reservations)
}

func (controller Controller) UpdateReservation(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid reservation id"})
		return
	}

	var reservation domain.Reservation
	if err := c.BindJSON(&reservation); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	updated, err := controller.service.UpdateReservation(id, reservation)
	if err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, updated)
}

func (controller Controller) DeleteReservation(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid reservation id"})
		return
	}

	if err := controller.service.DeleteReservation(id); err != nil {
		respondError(c, err)
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "reservation cancelled"})
}
