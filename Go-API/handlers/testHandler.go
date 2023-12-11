package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"project/appsql"
	"project/models"
)

func GetTestsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tests, err := appsql.SelectTestsAll(db)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(tests)
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

func GetTestByIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			TestID int `json:"testid"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		test, err := appsql.SelectTestById(db, request.TestID)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(test)
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

func PostTestHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var test models.Test
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&test); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		imageBase64 := test.ImageBase64
		imageBytes, err := base64.StdEncoding.DecodeString(imageBase64)
		if err != nil {
			http.Error(w, "Invalid image data", http.StatusBadRequest)
			return
		}
		test.Image = imageBytes

		questions, err := appsql.SelectQuestionsByIds(db, test.Questions)
		if err != nil {
			http.Error(w, "Error retrieving questions from database", http.StatusBadRequest)
			return
		}

		var MaxScore int = 0
		for i := 0; i < len(questions); i++ {
			MaxScore += questions[i].Points
		}

		test.MaxScore = MaxScore

		if err := appsql.InsertTest(db, test); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, test)
	}
}
