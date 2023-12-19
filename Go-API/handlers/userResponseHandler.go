package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/appsql"
	"project/models"
)

func GetUserResponsesHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userresponses, err := appsql.SelectUserResponsesAll(db)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(userresponses)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}

func GetUserResponsesByAttemptIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			AttemptID int `json:"attemptid"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userresponses, err := appsql.SelectUserResponsesByAttemptId(db, request.AttemptID)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(userresponses)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}

func PostUserResponseHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var userresponse models.UserResponse
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&userresponse); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := appsql.InsertUserResponse(db, userresponse); err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		respondJSON(w, userresponse)
	}
}
