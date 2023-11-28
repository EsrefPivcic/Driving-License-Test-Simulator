package dal

import (
	"database/sql"
	"log"
)

func UpdatePasswordInDB(db *sql.DB, userID int, newPassword string) error {
	_, err := db.Exec("UPDATE user SET Password = $1 WHERE ID = $2", newPassword, userID)
	if err != nil {
		log.Printf("Error updating password in the database: %v", err)
		return err
	}
	return nil
}

func UpdateNameInDB(db *sql.DB, userID int, newName string) error {
	_, err := db.Exec("UPDATE user SET Name = $1 WHERE ID = $2", newName, userID)
	if err != nil {
		log.Printf("Error updating name in the database: %v", err)
		return err
	}
	return nil
}

func UpdateSurnameInDB(db *sql.DB, userID int, newSurname string) error {
	_, err := db.Exec("UPDATE user SET Surname = $1 WHERE ID = $2", newSurname, userID)
	if err != nil {
		log.Printf("Error updating surname in the database: %v", err)
		return err
	}
	return nil
}

func UpdateUsernameInDB(db *sql.DB, userID int, newUsername string) error {
	_, err := db.Exec("UPDATE user SET Username = $1 WHERE ID = $2", newUsername, userID)
	if err != nil {
		log.Printf("Error updating username in the database: %v", err)
		return err
	}
	return nil
}

func UpdateEmailInDB(db *sql.DB, userID int, newEmail string) error {
	_, err := db.Exec("UPDATE user SET Email = $1 WHERE ID = $2", newEmail, userID)
	if err != nil {
		log.Printf("Error updating email in the database: %v", err)
		return err
	}
	return nil
}
