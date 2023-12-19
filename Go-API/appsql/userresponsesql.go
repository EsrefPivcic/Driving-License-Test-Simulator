package appsql

import (
	"database/sql"
	"log"
	"project/models"

	"github.com/lib/pq"
)

func InsertUserResponse(db *sql.DB, s models.UserResponse) error {
	optionsArray := pq.Array(s.SelectedOptions)
	_, err := db.Exec("INSERT INTO UserResponse (AttemptID, QuestionID, SelectedOptions, IsCorrect) VALUES ($1, $2, $3, $4)",
		s.AttemptID, s.QuestionID, optionsArray, s.IsCorrect)
	if err != nil {
		log.Printf("Error inserting userresponse into the database: %v", err)
		return err
	}
	return nil
}

func InsertUserResponses(db *sql.DB, responses []models.UserResponse, attemptid int) error {
	for i := 0; i < len(responses); i++ {
		s := responses[i]
		optionsArray := pq.Array(s.SelectedOptions)
		_, err := db.Exec("INSERT INTO UserResponse (AttemptID, QuestionID, SelectedOptions, IsCorrect) VALUES ($1, $2, $3, $4)",
			attemptid, s.QuestionID, optionsArray, s.IsCorrect)
		if err != nil {
			log.Printf("Error inserting userresponses into the database: %v", err)
			return err
		}
	}
	return nil
}

func SelectUserResponsesByAttemptId(db *sql.DB, attemptID int) ([]models.UserResponse, error) {
	id := attemptID

	query := "SELECT * FROM \"userresponse\" WHERE attemptid = $1"
	rows, err := db.Query(query, id)
	if err != nil {
		log.Printf("Error selecting userresponses by attempt id: %v", err)
		return nil, err
	}
	defer rows.Close()

	var userresponses []models.UserResponse

	for rows.Next() {
		var userresponse models.UserResponse
		var optionsArray pq.Int64Array

		err := rows.Scan(
			&userresponse.ID,
			&userresponse.AttemptID,
			&userresponse.QuestionID,
			&optionsArray,
			&userresponse.IsCorrect,
		)

		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		userresponse.SelectedOptions = make([]int, len(optionsArray))
		for i, val := range optionsArray {
			userresponse.SelectedOptions[i] = int(val)
		}
		userresponses = append(userresponses, userresponse)
	}

	return userresponses, nil
}

func SelectUserResponsesAll(db *sql.DB) ([]models.UserResponse, error) {
	rows, err := db.Query(`
	SELECT
	sr.ID AS UserResponseID,
	sr.AttemptID AS UserResponseAttemptID,
	sr.QuestionID AS UserResponseQuestionID,
	sr.SelectedOptions AS SelectedOptions,
	sr.IsCorrect AS IsCorrect,
	a.ID AS AttemptID,
	a.UserID AS AttemptUserID,
	a.TestID AS AttemptTestID,
	a.Score as AttemptScore,
	a.Passed as AttemptPassed,
	q.ID as QuestionID,
	q.QuestionText as QuestionText,
	q.Image AS Image,
	q.Points AS Points,
	q.MultipleSelect AS MultipleSelect
FROM UserResponse AS sr
INNER JOIN Attempt AS a ON sr.AttemptID = a.ID
INNER JOIN Question AS q ON sr.QuestionID = q.ID
    `)
	if err != nil {
		log.Printf("Error selecting all user responses: %v", err)
		return nil, err
	}
	defer rows.Close()

	var userresponses []models.UserResponse

	for rows.Next() {
		var userresponse models.UserResponse
		var attempt models.Attempt
		var question models.Question
		var optionsArray pq.Int64Array
		err := rows.Scan(
			&userresponse.ID,
			&userresponse.AttemptID,
			&userresponse.QuestionID,
			&optionsArray,
			&userresponse.IsCorrect,
			&attempt.ID,
			&attempt.UserID,
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

		userresponse.SelectedOptions = make([]int, len(optionsArray))
		for i, val := range optionsArray {
			userresponse.SelectedOptions[i] = int(val)
		}

		userresponse.Attempt = attempt
		userresponse.Question = question
		userresponses = append(userresponses, userresponse)
	}

	return userresponses, nil
}
