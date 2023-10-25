package models

import (
	"database/sql"
	"log"
)

type Question struct {
	ID             int
	QuestionText   string
	Image          []byte
	Points         int
	MultipleSelect bool
}

func (q *Question) CreateInDBQuestion(db *sql.DB) error {
	_, err := db.Exec("INSERT INTO Question (QuestionText, Image, Points, MultipleSelect) VALUES ($1, NULL, $2, $3)",
		q.QuestionText, q.Points, q.MultipleSelect)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func (q *Question) RetrieveFromDBQuestion(db *sql.DB) ([]Question, error) {
	rows, err := db.Query("SELECT * FROM Question")
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var questions []Question

	for rows.Next() {
		var question Question
		err := rows.Scan(
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

		questions = append(questions, question)
	}

	return questions, nil
}
