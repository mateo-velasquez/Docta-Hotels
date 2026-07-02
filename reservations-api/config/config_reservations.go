package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

var (
	MySQLHost     string
	MySQLPort     string
	MySQLDatabase string
	MySQLUsername string
	MySQLPassword string
)

func init() {
	if err := godotenv.Load("config/.env"); err != nil {
		fmt.Println("warning: config/.env not found, using environment variables")
	}

	MySQLHost = os.Getenv("MYSQL_HOST")
	MySQLPort = os.Getenv("MYSQL_PORT")
	MySQLDatabase = os.Getenv("MYSQL_DATABASE")
	MySQLUsername = os.Getenv("MYSQL_USERNAME")
	MySQLPassword = os.Getenv("MYSQL_PASSWORD")
}
