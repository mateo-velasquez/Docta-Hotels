package app

import (
	"os"

	"users-api/config"
	"users-api/src/controller"
	repositories "users-api/src/repositories"
	"users-api/src/service"
	"users-api/src/tokenizer"

	log "github.com/sirupsen/logrus"
)

var serviceController controller.Controller

func init() {
	log.SetOutput(os.Stdout)
	log.SetLevel(log.DebugLevel)
	log.Info("Starting logger system")
}

func initDependencies() {
	mySQLRepository := repositories.NewMySQL(repositories.MySQLConfig{
		Host:     config.MySQLHost,
		Port:     config.MySQLPort,
		Database: config.MySQLDatabase,
		Username: config.MySQLUsername,
		Password: config.MySQLPassword,
	})

	cacheRepository := repositories.NewCache(repositories.CacheConfig{
		TTL:          config.CacheDuration,
		MaxSize:      5000,
		ItemsToPrune: 500,
	})

	memcachedRepository := repositories.NewMemcached(repositories.MemcachedConfig{
		Host: config.MemcachedHost,
		Port: config.MemcachedPort,
	})

	jwtTokenizer := tokenizer.NewTokenizer(tokenizer.JWTConfig{
		Key:      config.JWTKey,
		Duration: config.JWTDuration,
	})

	svc := service.NewService(mySQLRepository, cacheRepository, memcachedRepository, jwtTokenizer)
	serviceController = controller.NewController(svc)
}
