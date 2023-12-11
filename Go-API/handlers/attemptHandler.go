package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/appsql"
	"project/models"
	"project/services"
)

func GetAttemptsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		attempts, err := appsql.SelectAttemptsAll(db)
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

func GetAttemptsByUserIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token string `json:"token"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)
		if err != nil {
			log.Printf("Error retrieving a UserID: %v", err)
		}

		attempts, err := appsql.SelectAttemptsByUserId(db, userID)
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
		var responses []models.UserResponse
		var request struct {
			Token         string                `json:"token"`
			TestID        int                   `json:"testid"`
			UserResponses []models.UserResponse `json:"userresponses"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		attempt, responses = services.CalculateTestPass(db, request.UserResponses, request.TestID, request.Token)

		attemptID, err := appsql.InsertAttemptReturnId(db, attempt)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if err := appsql.InsertUserResponses(db, responses, attemptID); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		attempt.ID = attemptID

		respondJSON(w, attempt)
	}
}

func SubmitEmptyAttemptHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var attempt models.Attempt
		var request struct {
			Token  string `json:"token"`
			TestID int    `json:"testid"`
		}
		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}
		userID, err := appsql.SelectUserIdByToken(db, request.Token)
		if err != nil {
			log.Printf("Error retrieving a UserID: %v", err)
		}
		test, err := appsql.SelectTestById(db, request.TestID)
		if err != nil {
			log.Printf("Error retrieving Test: %v", err)
		}
		questions, errq := appsql.SelectQuestionsByIds(db, test.Questions)
		if errq != nil {
			log.Printf("Error retrieving Questions: %v", errq)
		}
		var MaxScore int = 0
		for i := 0; i < len(questions); i++ {
			MaxScore += questions[i].Points
		}
		attempt.UserID = userID
		attempt.TestID = request.TestID
		attempt.Score = 0
		attempt.MaxScore = MaxScore
		attempt.Percentage = 0
		attempt.Passed = false

		attemptID, err := appsql.InsertAttemptReturnId(db, attempt)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		attempt.ID = attemptID

		respondJSON(w, attempt)
	}
}

func PostAttemptHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var attempt models.Attempt
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&attempt); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := appsql.InsertAttempt(db, attempt); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, attempt)
	}
}
