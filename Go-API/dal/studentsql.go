package dal

import (
	"database/sql"
	"log"
	"project/models"
)

func CreateInDBStudent(db *sql.DB, s models.Student) error {
	_, err := db.Exec("INSERT INTO Student (Name, Surname, Username, Email, Password) VALUES ($1, $2, $3, $4, $5)",
		s.Name, s.Surname, s.Username, s.Email, s.Password)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
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
