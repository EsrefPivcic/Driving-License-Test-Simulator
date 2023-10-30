package models

import (
	"database/sql"
	"log"

	"github.com/lib/pq"
)

type StudentResponse struct {
	ID              int
	AttemptID       int
	Attempt         Attempt
	QuestionID      int
	Question        Question
	SelectedOptions []int
	IsCorrect       bool
}

func (s *StudentResponse) CreateInDBStudentResponse(db *sql.DB) error {
	optionsArray := pq.Array(s.SelectedOptions)
	_, err := db.Exec("INSERT INTO StudentResponse (AttemptID, QuestionID, SelectedOptions, IsCorrect) VALUES ($1, $2, $3, $4)",
		s.AttemptID, s.QuestionID, optionsArray, s.IsCorrect)
	if err != nil {
		log.Printf("Error inserting test into the database: %v", err)
		return err
	}
	return nil
}

func (o *StudentResponse) RetrieveFromDBStudentResponse(db *sql.DB) ([]StudentResponse, error) {
	rows, err := db.Query(`
	SELECT
	sr.ID AS StudentResponseID,
	sr.AttemptID AS StudentResponseAttemptID,
	sr.QuestionID AS StudentResponseQuestionID,
	sr.SelectedOptions AS SelectedOptions,
	sr.IsCorrect AS IsCorrect,
	a.ID AS AttemptID,
	a.StudentID AS AttemptStudentID,
	a.TestID AS AttemptTestID,
	a.Score as AttemptScore,
	a.Passed as AttemptPassed,
	q.ID as QuestionID,
	q.QuestionText as QuestionText,
	q.Image AS Image,
	q.Points AS Points,
	q.MultipleSelect AS MultipleSelect
FROM StudentResponse AS sr
INNER JOIN Attempt AS a ON sr.AttemptID = a.ID
INNER JOIN Question AS q ON sr.QuestionID = q.ID
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var studentresponses []StudentResponse

	for rows.Next() {
		var studentresponse StudentResponse
		var attempt Attempt
		var question Question
		var optionsArray pq.Int64Array
		err := rows.Scan(
			&studentresponse.ID,
			&studentresponse.AttemptID,
			&studentresponse.QuestionID,
			&optionsArray,
			&studentresponse.IsCorrect,
			&attempt.ID,
			&attempt.StudentID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&question.ID,
			&question.QuestionText,
			&question.Image,
			&question.Points,
			&question.MultipleSelect,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		studentresponse.SelectedOptions = make([]int, len(optionsArray))
		for i, val := range optionsArray {
			studentresponse.SelectedOptions[i] = int(val)
		}

		studentresponse.Attempt = attempt
		studentresponse.Question = question
		studentresponses = append(studentresponses, studentresponse)
	}

	return studentresponses, nil
}
