package dal

import (
	"database/sql"
	"log"
	"project/utils"
)

func ValidateCredentials(db *sql.DB, username, passwordInput string) (bool, error) {
	var password string
	err := db.QueryRow("SELECT password FROM student WHERE username = $1", username).Scan(&password)
	if err != nil {
		log.Printf("Error validating credentials for username %s: %v", username, err)
		return false, err
	}

	// Add console log for username and password
	log.Printf("Validating credentials for username: %s, password: %s", username, passwordInput)
	log.Printf("dbpassword: %s", password)

	valid := utils.ComparePasswords(password, passwordInput)
	return valid, nil
}
