package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveAttemptsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
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
}

func CreateAttemptHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var attempt models.Attempt
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&attempt); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := attempt.CreateInDBAttempt(db); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, attempt)
	}
}
