package appsql

import (
	"database/sql"
	"encoding/base64"
	"log"
	"project/models"

	"github.com/lib/pq"
)

func InsertAttempt(db *sql.DB, a models.Attempt) error {
	_, err := db.Exec("INSERT INTO Attempt (UserID, TestID, Score, Passed, MaxScore, Percentage) VALUES ($1, $2, $3, $4, $5, $6)",
		a.UserID, a.TestID, a.Score, a.Passed, a.MaxScore, a.Percentage)
	if err != nil {
		log.Printf("Error inserting attempt into the database: %v", err)
		return err
	}
	return nil
}

func InsertAttemptReturnId(db *sql.DB, a models.Attempt) (int, error) {
	var id int
	err := db.QueryRow("INSERT INTO Attempt (UserID, TestID, Score, Passed, MaxScore, Percentage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING ID",
		a.UserID, a.TestID, a.Score, a.Passed, a.MaxScore, a.Percentage).Scan(&id)
	if err != nil {
		log.Printf("Error inserting attempt into the database: %v", err)
		return 0, err
	}
	return id, nil
}

func SelectAttemptsAll(db *sql.DB) ([]models.Attempt, error) {
	rows, err := db.Query(`
	SELECT
	a.ID AS AttemptID,
	a.UserID AS AttemptUserID,
	a.TestID AS AttemptTestID,
	a.Score AS Score,
	a.Passed AS Passed,
	a.MaxScore AS MaxScore,
	a.Percentage AS Percentage,
	s.ID AS UserID,
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
INNER JOIN User AS s ON a.UserID = s.ID
INNER JOIN Test AS t ON a.TestID = t.ID
    `)
	if err != nil {
		log.Printf("Error selecting all attempts: %v", err)
		return nil, err
	}
	defer rows.Close()

	var attempts []models.Attempt

	for rows.Next() {
		var attempt models.Attempt
		var user models.User
		var test models.Test

		var questionArray pq.Int64Array

		err := rows.Scan(
			&attempt.ID,
			&attempt.UserID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&attempt.MaxScore,
			&attempt.Percentage,
			&user.ID,
			&user.Name,
			&user.Surname,
			&user.Username,
			&user.Email,
			&user.Password,
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

		attempt.User = user
		attempt.Test = test

		attempts = append(attempts, attempt)
	}

	return attempts, nil
}

func SelectAttemptsByUserId(db *sql.DB, userId int) ([]models.Attempt, error) {
	query := `SELECT 
	a.ID AS AttemptID,
	a.UserID AS AttemptUserID,
	a.TestID AS AttemptTestID,
	a.Score AS Score,
	a.Passed AS Passed,
	a.MaxScore AS MaxScore,
	a.Percentage AS Percentage,
	t.ID AS TestID,
	t.Title AS Title,
	t.Description AS Description,
	t.Questions AS Question,
	t.Category AS Category,
	t.Image AS Image,
	t.Duration AS Duration
FROM Attempt AS a
INNER JOIN Test AS t ON a.TestID = t.ID
WHERE a.UserID = $1`
	rows, err := db.Query(query, userId)
	if err != nil {
		log.Printf("Error selecting attempts by user id: %v", err)
		return []models.Attempt{}, err
	}
	defer rows.Close()

	var attempts []models.Attempt

	for rows.Next() {
		var attempt models.Attempt
		var test models.Test

		var imageArray pq.ByteaArray
		var questionArray pq.Int64Array

		err := rows.Scan(
			&attempt.ID,
			&attempt.UserID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&attempt.MaxScore,
			&attempt.Percentage,
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&imageArray,
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

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		attempt.Test = test
		attempt.Test.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		attempts = append(attempts, attempt)
	}

	return attempts, nil
}
