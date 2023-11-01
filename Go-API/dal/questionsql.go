package dal

import (
	"database/sql"
	"log"
	"project/models"
)

func CreateInDBQuestion(db *sql.DB, q models.Question) error {
	_, err := db.Exec("INSERT INTO Question (QuestionText, Image, Points, MultipleSelect) VALUES ($1, NULL, $2, $3)",
		q.QuestionText, q.Points, q.MultipleSelect)
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
