package app

import (
	"reservations-api/config"
	"reservations-api/src/controller"
	repositories "reservations-api/src/repositories"
	services "reservations-api/src/services"
)

var serviceController controller.Controller

func initDependencies() {
	mySQLRepository := repositories.NewMySQL(repositories.MySQLConfig{
		Host:     config.MySQLHost,
		Port:     config.MySQLPort,
		Database: config.MySQLDatabase,
		Username: config.MySQLUsername,
		Password: config.MySQLPassword,
	})

	svc := services.NewService(mySQLRepository)
	serviceController = controller.NewController(svc)
}
