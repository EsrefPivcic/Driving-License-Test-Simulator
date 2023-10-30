package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveStudentResponsesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		studentresponses, err := (&models.StudentResponse{}).RetrieveFromDBStudentResponse(db)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(studentresponses)
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

func CreateStudentResponseHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var studentresponse models.StudentResponse
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&studentresponse); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := studentresponse.CreateInDBStudentResponse(db); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, studentresponse)
	}
}
