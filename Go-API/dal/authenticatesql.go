package dal

import (
	"database/sql"
	"log"
	"project/utils"
)

func CheckTokenDB(db *sql.DB, token string) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM AuthenticationToken WHERE Value = $1", token).Scan(&count)
	if err != nil {
		log.Printf("Error checking user existence: %v", err)
		return false, err
	}
	return count > 0, nil
}

func CreateInDBAuthentication(db *sql.DB, studentid int, token string) error {
	_, err := db.Exec("INSERT INTO AuthenticationToken (Value, StudentID) VALUES ($1, $2)",
		token, studentid)
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

func ValidateCredentials(db *sql.DB, username, passwordInput string) (bool, int, error) {
	var id int
	var password string
	err := db.QueryRow("SELECT id, password FROM student WHERE username = $1", username).Scan(&id, &password)
	if err != nil {
		log.Printf("Error validating credentials for username %s: %v", username, err)
		return false, 0, err
	}

	valid := utils.ComparePasswords(password, passwordInput)
	return valid, id, nil
}

func RetrieveStudentIDByTokenFromDB(db *sql.DB, token string) (int, error) {
	var studentID int

	query := "SELECT StudentID FROM AuthenticationToken WHERE Value = $1"
	row := db.QueryRow(query, token)

	err := row.Scan(&studentID)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return 0, err
	}

	return studentID, nil
}
