package models

import (
	"database/sql"
	"log"

	"github.com/lib/pq"
)

type Attempt struct {
	ID        int
	StudentID int
	Student   Student
	TestID    int
	Test      Test
	Score     int
	Passed    bool
}

func (a *Attempt) CreateInDBAttempt(db *sql.DB) error {
	_, err := db.Exec("INSERT INTO Attempt (StudentID, TestID, Score, Passed) VALUES ($1, $2, $3, $4)",
		a.StudentID, a.TestID, a.Score, a.Passed)
	if err != nil {
		log.Printf("Error inserting attempt into the database: %v", err)
		return err
	}
	return nil
}

func (a *Attempt) RetrieveFromDBAttempt(db *sql.DB) ([]Attempt, error) {
	rows, err := db.Query(`
	SELECT
	a.ID AS AttemptID,
	a.StudentID AS AttemptStudentID,
	a.TestID AS AttemptTestID,
	a.Score AS Score,
	a.Passed AS Passed,
	s.ID AS StudentID,
	s.Name AS Name,
	s.Surname AS Surname,
	s.Username AS Username,
	s.Email AS Email,
	s.Password AS Password,
	t.ID AS TestID,
	t.Title AS Title,
	t.Description AS Description,
	t.Questions AS Question,
	t.Category AS Category,
	t.Image AS Image,
	t.Duration AS Duration
FROM Attempt AS a
INNER JOIN Student AS s ON a.StudentID = s.ID
INNER JOIN Test AS t ON a.TestID = t.ID
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var attempts []Attempt

	for rows.Next() {
		var attempt Attempt
		var student Student
		var test Test

		var questionArray pq.Int64Array

		err := rows.Scan(
			&attempt.ID,
			&attempt.StudentID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&student.ID,
			&student.Name,
			&student.Surname,
			&student.Username,
			&student.Email,
			&student.Password,
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Image,
			&test.Duration,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		attempt.Student = student
		attempt.Test = test

		attempts = append(attempts, attempt)
	}

	return attempts, nil
}
