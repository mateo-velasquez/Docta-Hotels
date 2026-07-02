package app

import log "github.com/sirupsen/logrus"

func mapUrls() {
	router.POST("/reservations", serviceController.InsertReservation)
	router.GET("/reservations/:id", serviceController.GetReservationById)
	router.GET("/reservations", serviceController.GetReservations)
	router.GET("/reservations/user/:id", serviceController.GetReservationsByUser)
	router.PUT("/reservations/:id", serviceController.UpdateReservation)
	router.DELETE("/reservations/:id", serviceController.DeleteReservation)

	log.Info("Finishing mappings configurations")
}
