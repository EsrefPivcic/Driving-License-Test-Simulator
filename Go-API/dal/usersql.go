package dal

import (
	"database/sql"
	"encoding/base64"
	"log"
	"project/models"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func CreateInDBUser(db *sql.DB, s models.User) error {
	hashedPassword, err := HashPassword(s.Password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return err
	}
	imageArray := pq.ByteaArray([][]byte{s.Image})
	_, err = db.Exec("INSERT INTO \"user\" (Name, Surname, Username, Email, Password, Image, IsStudent, IsAdmin) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		s.Name, s.Surname, s.Username, s.Email, hashedPassword, imageArray, s.IsStudent, s.IsAdmin)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func UpdateInDBUser(db *sql.DB, user models.User) error {
	imageArray := pq.ByteaArray([][]byte{user.Image})
	_, err := db.Exec("UPDATE \"user\" SET Name=$1, Surname=$2, Username=$3, Email=$4, Image=$5 WHERE ID=$6",
		user.Name, user.Surname, user.Username, user.Email, imageArray, user.ID)
	if err != nil {
		log.Printf("Error updating user in the database: %v", err)
		return err
	}
	return nil
}

func HashPassword(password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedPassword), nil
}

func RetrieveFromDBUser(db *sql.DB) ([]models.User, error) {
	rows, err := db.Query("SELECT * FROM \"user\" AS s")
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var users []models.User
	var imageArray pq.ByteaArray

	for rows.Next() {
		var user models.User
		err := rows.Scan(
			&user.ID,
			&user.Name,
			&user.Surname,
			&user.Username,
			&user.Email,
			&user.Password,
			&imageArray,
			&user.IsStudent,
			&user.IsAdmin,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}
		user.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		users = append(users, user)
	}

	return users, nil
}

func RetrieveUserByIdFromDB(db *sql.DB, userID int) (models.User, error) {
	id := userID

	query := "SELECT ID, Name, Surname, Username, Email, Image, IsStudent, IsAdmin FROM \"user\" WHERE id = $1"
	row := db.QueryRow(query, id)

	var user models.User
	var imageArray pq.ByteaArray

	err := row.Scan(
		&user.ID,
		&user.Name,
		&user.Surname,
		&user.Username,
		&user.Email,
		&imageArray,
		&user.IsStudent,
		&user.IsAdmin,
	)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.User{}, err
	}
	var imageBytes []byte
	for _, chunk := range imageArray {
		imageBytes = append(imageBytes, chunk...)
	}
	user.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

	return user, nil
}

func RetrieveUserPasswordByIdFromDB(db *sql.DB, userID int) (models.User, error) {
	id := userID

	query := "SELECT Password FROM \"user\" WHERE id = $1"
	row := db.QueryRow(query, id)

	var user models.User

	err := row.Scan(
		&user.Password,
	)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.User{}, err
	}

	return user, nil
}

func UpdatePasswordInDB(db *sql.DB, userID int, newPassword string) error {
	_, err := db.Exec("UPDATE \"user\" SET Password = $1 WHERE ID = $2", newPassword, userID)
	if err != nil {
		log.Printf("Error updating password in the database: %v", err)
		return err
	}
	return nil
}

func UpdateNameInDB(db *sql.DB, userID int, newName string) error {
	_, err := db.Exec("UPDATE \"user\" SET Name = $1 WHERE ID = $2", newName, userID)
	if err != nil {
		log.Printf("Error updating name in the database: %v", err)
		return err
	}
	return nil
}

func UpdateSurnameInDB(db *sql.DB, userID int, newSurname string) error {
	_, err := db.Exec("UPDATE \"user\" SET Surname = $1 WHERE ID = $2", newSurname, userID)
	if err != nil {
		log.Printf("Error updating surname in the database: %v", err)
		return err
	}
	return nil
}

func UpdateUsernameInDB(db *sql.DB, userID int, newUsername string) error {
	_, err := db.Exec("UPDATE \"user\" SET Username = $1 WHERE ID = $2", newUsername, userID)
	if err != nil {
		log.Printf("Error updating username in the database: %v", err)
		return err
	}
	return nil
}

func UpdateEmailInDB(db *sql.DB, userID int, newEmail string) error {
	_, err := db.Exec("UPDATE \"user\" SET Email = $1 WHERE ID = $2", newEmail, userID)
	if err != nil {
		log.Printf("Error updating email in the database: %v", err)
		return err
	}
	return nil
}
