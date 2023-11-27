package dal

import (
	"database/sql"
	"encoding/base64"
	"log"
	"project/models"

	"github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

func CreateInDBStudent(db *sql.DB, s models.Student) error {
	hashedPassword, err := HashPassword(s.Password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return err
	}
	imageArray := pq.ByteaArray([][]byte{s.Image})
	_, err = db.Exec("INSERT INTO student (Name, Surname, Username, Email, Password, Image) VALUES ($1, $2, $3, $4, $5, $6)",
		s.Name, s.Surname, s.Username, s.Email, hashedPassword, imageArray)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func UpdateInDBStudent(db *sql.DB, student models.Student) error {
	imageArray := pq.ByteaArray([][]byte{student.Image})
	_, err := db.Exec("UPDATE student SET Name=$1, Surname=$2, Username=$3, Email=$4, Image=$5 WHERE ID=$6",
		student.Name, student.Surname, student.Username, student.Email, imageArray, student.ID)
	if err != nil {
		log.Printf("Error updating student in the database: %v", err)
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

func RetrieveFromDBStudent(db *sql.DB) ([]models.Student, error) {
	rows, err := db.Query(`
        SELECT *
        FROM Student AS s
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var students []models.Student

	for rows.Next() {
		var student models.Student
		err := rows.Scan(
			&student.ID,
			&student.Name,
			&student.Surname,
			&student.Username,
			&student.Email,
			&student.Password,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		students = append(students, student)
	}

	return students, nil
}

func RetrieveStudentByIdFromDB(db *sql.DB, studentID int) (models.Student, error) {
	id := studentID

	query := "SELECT ID, Name, Surname, Username, Email, Image FROM \"student\" WHERE id = $1"
	row := db.QueryRow(query, id)

	var student models.Student
	var imageArray pq.ByteaArray

	err := row.Scan(
		&student.ID,
		&student.Name,
		&student.Surname,
		&student.Username,
		&student.Email,
		&imageArray,
	)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.Student{}, err
	}
	var imageBytes []byte
	for _, chunk := range imageArray {
		imageBytes = append(imageBytes, chunk...)
	}
	student.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

	return student, nil
}

func RetrieveStudentPasswordByIdFromDB(db *sql.DB, studentID int) (models.Student, error) {
	id := studentID

	query := "SELECT Password FROM \"student\" WHERE id = $1"
	row := db.QueryRow(query, id)

	var student models.Student

	err := row.Scan(
		&student.Password,
	)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.Student{}, err
	}

	return student, nil
}
