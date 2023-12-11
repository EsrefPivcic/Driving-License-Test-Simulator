package appsql

import (
	"database/sql"
	"log"
)

func CountToken(db *sql.DB, token string) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM AuthenticationToken WHERE Value = $1", token).Scan(&count)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, err
	}
	return count > 0, nil
}

func InsertToken(db *sql.DB, userid int, token string) error {
	_, err := db.Exec("INSERT INTO AuthenticationToken (Value, UserID) VALUES ($1, $2)",
		token, userid)
	if err != nil {
		log.Printf("Error inserting token into the database: %v", err)
		return err
	}
	return nil
}

func DeleteToken(db *sql.DB, tokenValue string) error {
	_, err := db.Exec("DELETE FROM AuthenticationToken WHERE Value = $1", tokenValue)
	if err != nil {
		log.Printf("Error deleting token from the database: %v", err)
		return err
	}
	return nil
}

func SelectUserIdByToken(db *sql.DB, token string) (int, error) {
	var userID int

	query := "SELECT UserID FROM AuthenticationToken WHERE Value = $1"
	row := db.QueryRow(query, token)

	err := row.Scan(&userID)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return 0, err
	}

	return userID, nil
}
