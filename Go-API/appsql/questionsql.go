package appsql

import (
	"database/sql"
	"encoding/base64"
	"errors"
	"log"
	"project/models"
	"strconv"

	"github.com/lib/pq"
)

func CreateInDBQuestion(db *sql.DB, q models.Question) error {
	imageArray := pq.ByteaArray([][]byte{q.Image})
	_, err := db.Exec("INSERT INTO Question (QuestionText, Points, MultipleSelect, Image) VALUES ($1, $2, $3, $4)",
		q.QuestionText, q.Points, q.MultipleSelect, imageArray)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func RetrieveFromDBQuestion(db *sql.DB) ([]models.Question, error) {
	rows, err := db.Query("SELECT * FROM Question")
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var questions []models.Question

	for rows.Next() {
		var question models.Question
		var imageArray pq.ByteaArray

		err := rows.Scan(
			&question.ID,
			&question.QuestionText,
			&question.Points,
			&question.MultipleSelect,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		question.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		questions = append(questions, question)
	}

	return questions, nil
}

func RetrieveQuestionsByIdsFromDB(db *sql.DB, questionIDs []int) ([]models.Question, error) {
	ids := ""
	for i, id := range questionIDs {
		if i > 0 {
			ids += ","
		}
		ids += strconv.Itoa(id)
	}

	query := "SELECT * FROM Question WHERE ID IN (" + ids + ")"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var questions []models.Question

	for rows.Next() {
		var question models.Question
		var imageArray pq.ByteaArray

		err := rows.Scan(
			&question.ID,
			&question.QuestionText,
			&question.Points,
			&question.MultipleSelect,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		question.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		questions = append(questions, question)
	}

	return questions, nil
}

func RetrieveQuestionByIdFromDB(db *sql.DB, questionID int) (models.Question, error) {
	id := questionID

	query := "SELECT * FROM \"question\" WHERE id = $1"
	rows, err := db.Query(query, id)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return models.Question{}, err
	}
	defer rows.Close()

	var question models.Question

	var imageArray pq.ByteaArray

	if rows.Next() {
		err = rows.Scan(
			&question.ID,
			&question.QuestionText,
			&question.Points,
			&question.MultipleSelect,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return models.Question{}, err
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		question.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)
	} else {
		return models.Question{}, errors.New("question not found")
	}

	return question, nil
}
