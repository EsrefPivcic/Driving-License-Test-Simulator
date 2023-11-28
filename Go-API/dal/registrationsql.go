package dal

import (
	"database/sql"
	"log"
)

func CheckUserExists(db *sql.DB, username, email string) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM \"user\" WHERE username = $1 OR email = $2", username, email).Scan(&count)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, err
	}
	return count > 0, nil
}
