package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/dal"
	"project/models"
)

func RetrieveStudentsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		students, err := dal.RetrieveFromDBStudent(db)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(students)
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

func CreateStudentHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var student models.Student
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&student); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := dal.CreateInDBStudent(db, student); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, student)
	}
}

func RetrieveStudentByTokenHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token string `json:"token"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		student, err := dal.RetrieveStudentByIdFromDB(db, studentID)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(student)
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
