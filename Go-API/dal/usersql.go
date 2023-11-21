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

func UpdateNameInDB(db *sql.DB, studentID int, newName string) error {
	_, err := db.Exec("UPDATE student SET Name = $1 WHERE ID = $2", newName, studentID)
	if err != nil {
		log.Printf("Error updating name in the database: %v", err)
		return err
	}
	return nil
}

func UpdateSurnameInDB(db *sql.DB, studentID int, newSurname string) error {
	_, err := db.Exec("UPDATE student SET Surname = $1 WHERE ID = $2", newSurname, studentID)
	if err != nil {
		log.Printf("Error updating surname in the database: %v", err)
		return err
	}
	return nil
}

func UpdateUsernameInDB(db *sql.DB, studentID int, newUsername string) error {
	_, err := db.Exec("UPDATE student SET Username = $1 WHERE ID = $2", newUsername, studentID)
	if err != nil {
		log.Printf("Error updating username in the database: %v", err)
		return err
	}
	return nil
}

func UpdateEmailInDB(db *sql.DB, studentID int, newEmail string) error {
	_, err := db.Exec("UPDATE student SET Email = $1 WHERE ID = $2", newEmail, studentID)
	if err != nil {
		log.Printf("Error updating email in the database: %v", err)
		return err
	}
	return nil
}
