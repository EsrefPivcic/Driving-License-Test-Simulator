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
		var request struct {
			TestID           int                      `json:"testid"`
			StudentResponses []models.StudentResponse `json:"studentresponses"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		var MaxScore int = 0
		var Score int = 0
		for i := 0; i < len(request.StudentResponses); i++ {
			var question, err1 = dal.RetrieveQuestionByIdFromDB(db, request.StudentResponses[i].QuestionID)
			result, err2 := services.CheckStudentResponseCorrect(db, request.StudentResponses[i])
			MaxScore += question.Points
			if err1 != nil {
				log.Printf("error: ", err1)
			}
			if err2 != nil {
				log.Printf("error: ", err2)
			}
			if result {
				Score += question.Points
			}
			var pass = Score / MaxScore * 100
			if pass < 90 {
				attempt.Passed = false
			}
			if pass >= 90 {
				attempt.Passed = true
			}
			attempt.StudentID = 3
			attempt.TestID = request.TestID
			attempt.Score = Score
		}

		if err := dal.CreateInDBAttempt(db, attempt); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

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
