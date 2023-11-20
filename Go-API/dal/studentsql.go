package dal

import (
	"database/sql"
	"log"
	"project/models"

	"golang.org/x/crypto/bcrypt"
)

func CreateInDBStudent(db *sql.DB, s models.Student) error {
	hashedPassword, err := HashPassword(s.Password)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		return err
	}

	_, err = db.Exec("INSERT INTO student (Name, Surname, Username, Email, Password) VALUES ($1, $2, $3, $4, $5)",
		s.Name, s.Surname, s.Username, s.Email, hashedPassword)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
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

	query := "SELECT ID, Name, Surname, Username, Email FROM \"student\" WHERE id = $1"
	row := db.QueryRow(query, id)

	var student models.Student

	err := row.Scan(
		&student.ID,
		&student.Name,
		&student.Surname,
		&student.Username,
		&student.Email,
	)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.Student{}, err
	}

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
