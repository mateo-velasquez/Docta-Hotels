package config

import (
	"fmt"
	"os"
	"time"

	"github.com/joho/godotenv"
)

const (
	CacheDuration = 30 * time.Second
	JWTDuration   = 24 * time.Hour
)

var (
	MySQLHost     string
	MySQLPort     string
	MySQLDatabase string
	MySQLUsername string
	MySQLPassword string
	MemcachedHost string
	MemcachedPort string
	JWTKey        string
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
	MemcachedHost = os.Getenv("MEMCACHED_HOST")
	MemcachedPort = os.Getenv("MEMCACHED_PORT")
	JWTKey = os.Getenv("JWT_KEY")
}
