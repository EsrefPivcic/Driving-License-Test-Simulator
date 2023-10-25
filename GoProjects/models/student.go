package models

import (
	"database/sql"
	"log"
)

type Student struct {
	ID       int
	Name     string
	Surname  string
	Username string
	Email    string
	Password string
}

func (o *Student) CreateInDBStudent(db *sql.DB) error {
	_, err := db.Exec("INSERT INTO Student (Name, Surname, Username, Email, Password) VALUES ($1, $2, $3, $4, $5)",
		o.Name, o.Surname, o.Username, o.Email, o.Password)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func (o *Student) RetrieveFromDBStudent(db *sql.DB) ([]Student, error) {
	rows, err := db.Query(`
        SELECT *
        FROM Student AS s
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var students []Student

	for rows.Next() {
		var student Student
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
