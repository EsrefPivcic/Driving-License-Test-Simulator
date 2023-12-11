package appsql

import (
	"database/sql"
	"log"
	"project/models"
	"strconv"
)

func InsertOption(db *sql.DB, o models.Option) error {
	_, err := db.Exec("INSERT INTO Option (QuestionID, OptionText, IsCorrect) VALUES ($1, $2, $3)",
		o.QuestionID, o.OptionText, o.IsCorrect)
	if err != nil {
		log.Printf("Error inserting option into the database: %v", err)
		return err
	}
	return nil
}

func SelectOptionsAll(db *sql.DB) ([]models.Option, error) {
	rows, err := db.Query(`
        SELECT
            o.ID AS OptionID,
            o.QuestionID AS OptionQuestionID,
            o.OptionText AS OptionOptionText,
            o.IsCorrect AS OptionIsCorrect,
            q.ID AS QuestionID,
            q.QuestionText AS QuestionText,
            q.Image AS Image,
            q.Points AS Points,
            q.MultipleSelect AS MultipleSelect
        FROM Option AS o
        INNER JOIN Question AS q ON o.QuestionID = q.ID
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var options []models.Option

	for rows.Next() {
		var option models.Option
		var question models.Question
		err := rows.Scan(
			&option.ID,
			&option.QuestionID,
			&option.OptionText,
			&option.IsCorrect,
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

		option.Question = question
		options = append(options, option)
	}

	return options, nil
}

func SelectOptionsByQuestionIds(db *sql.DB, questionIDs []int) ([]models.Option, error) {
	ids := ""
	for i, id := range questionIDs {
		if i > 0 {
			ids += ","
		}
		ids += strconv.Itoa(id)
	}

	query := "SELECT * FROM Option WHERE questionid IN (" + ids + ")"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var options []models.Option

	for rows.Next() {
		var option models.Option
		err := rows.Scan(
			&option.ID,
			&option.QuestionID,
			&option.OptionText,
			&option.IsCorrect,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		options = append(options, option)
	}

	return options, nil
}

func SelectOptionsByIds(db *sql.DB, IDs []int) ([]models.Option, error) {
	ids := ""
	for i, id := range IDs {
		if i > 0 {
			ids += ","
		}
		ids += strconv.Itoa(id)
	}

	query := "SELECT * FROM Option WHERE id IN (" + ids + ")"
	rows, err := db.Query(query)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var options []models.Option

	for rows.Next() {
		var option models.Option
		err := rows.Scan(
			&option.ID,
			&option.QuestionID,
			&option.OptionText,
			&option.IsCorrect,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		options = append(options, option)
	}

	return options, nil
}

func SelectCorrectOptionsByQuestionId(db *sql.DB, questionID int) ([]models.Option, error) {
	id := questionID

	query := "SELECT * FROM \"option\" WHERE questionid = $1 AND iscorrect = TRUE"
	rows, err := db.Query(query, id)

	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var options []models.Option

	for rows.Next() {
		var option models.Option
		err := rows.Scan(
			&option.ID,
			&option.QuestionID,
			&option.OptionText,
			&option.IsCorrect,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		options = append(options, option)
	}

	return options, nil
}
