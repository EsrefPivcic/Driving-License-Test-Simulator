package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveQuestionsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	questions, err := (&models.Question{}).RetrieveFromDBQuestion(db)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(questions)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func CreateQuestionHandler(w http.ResponseWriter, r *http.Request) {
	var question models.Question
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&question); err != nil {
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

	if err := question.CreateInDBQuestion(db); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, question)
}
