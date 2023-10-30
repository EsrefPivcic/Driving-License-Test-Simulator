package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveAttemptsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	attempts, err := (&models.Attempt{}).RetrieveFromDBAttempt(db)
	if err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(attempts)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func CreateAttemptHandler(w http.ResponseWriter, r *http.Request) {
	var attempt models.Attempt
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&attempt); err != nil {
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

	if err := attempt.CreateInDBAttempt(db); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, attempt)
}
