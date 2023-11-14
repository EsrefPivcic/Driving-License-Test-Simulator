package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/dal"
	"project/models"
	"project/services"
)

func RetrieveAttemptsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		attempts, err := dal.RetrieveFromDBAttempt(db)
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

func SubmitAttemptHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var attempt models.Attempt
		var responses []models.StudentResponse
		var request struct {
			TestID           int                      `json:"testid"`
			StudentResponses []models.StudentResponse `json:"studentresponses"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		attempt, responses = services.CalculateTestPass(db, request.StudentResponses, request.TestID)

		attemptID, err := dal.CreateInDBAttemptGetId(db, attempt)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if err := dal.CreateInDBStudentResponses(db, responses, attemptID); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		attempt.ID = attemptID

		respondJSON(w, attempt)
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

		if err := dal.CreateInDBAttempt(db, attempt); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, attempt)
	}
}
