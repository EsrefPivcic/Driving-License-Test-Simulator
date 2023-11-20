package dal

import (
	"database/sql"
	"log"
)

func UpdatePasswordInDB(db *sql.DB, studentID int, newPassword string) error {
	_, err := db.Exec("UPDATE student SET Password = $1 WHERE ID = $2", newPassword, studentID)
	if err != nil {
		log.Printf("Error updating password in the database: %v", err)
		return err
	}
	return nil
}
