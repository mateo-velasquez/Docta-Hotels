package app

import log "github.com/sirupsen/logrus"

func mapUrls() {
	router.GET("/users/:id", serviceController.GetUserById)
	router.POST("/users", serviceController.CreateUser)
	router.POST("/login", serviceController.Login)

	log.Info("Finishing mappings configurations")
}
