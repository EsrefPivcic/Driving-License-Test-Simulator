package utils

import (
	"math/rand"

	"strings"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func ComparePasswords(storedPassword, providedPassword string) bool {
	if strings.HasPrefix(storedPassword, "$2a$") || strings.HasPrefix(storedPassword, "$2y$") {
		err := bcrypt.CompareHashAndPassword([]byte(storedPassword), []byte(providedPassword))
		return err == nil
	}
	return storedPassword == providedPassword
}

func GenerateSessionID() string {
	const letterBytes = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
	b := make([]byte, 20)
	for i := range b {
		b[i] = letterBytes[rand.Intn(len(letterBytes))]
	}
	return string(b)
}

func GenerateToken(username string) (string, error) {
	sessionID := GenerateSessionID()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"username":  username,
		"sessionID": sessionID,
	})

	tokenString, err := token.SignedString([]byte("your-secret-key"))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}
