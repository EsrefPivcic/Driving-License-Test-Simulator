package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveOptionsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

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
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
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
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		option.Question = question
		options = append(options, option)
	}

	response, err := json.Marshal(options)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func CreateOptionsHandler(w http.ResponseWriter, r *http.Request) {
	var option models.Option
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&option); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	_, err = db.Exec("INSERT INTO Option (QuestionID, OptionText, IsCorrect) VALUES ($1, $2, $3)",
		option.QuestionID, option.OptionText, option.IsCorrect)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, option)
}
