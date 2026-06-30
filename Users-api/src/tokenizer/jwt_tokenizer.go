package tokenizer

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type JWTConfig struct {
	Key      string
	Duration time.Duration
}

type JWT struct {
	key      []byte
	duration time.Duration
}

func NewTokenizer(config JWTConfig) JWT {
	return JWT{
		key:      []byte(config.Key),
		duration: config.Duration,
	}
}

func (t JWT) GenerateToken(username string, userID int64) (string, error) {
	claims := jwt.MapClaims{
		"sub":      userID,
		"username": username,
		"exp":      time.Now().Add(t.duration).Unix(),
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(t.key)
	if err != nil {
		return "", fmt.Errorf("error signing token: %w", err)
	}
	return signed, nil
}
