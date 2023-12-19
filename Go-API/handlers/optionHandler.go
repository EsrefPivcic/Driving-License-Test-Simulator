package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/appsql"
	"project/models"
)

func GetOptionsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		options, err := appsql.SelectOptionsAll(db)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(options)
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

func GetOptionsByQuestionIdsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			QuestionIDs []int `json:"Questions"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		options, err := appsql.SelectOptionsByQuestionIds(db, request.QuestionIDs)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(options)
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

func GetCorrectOptionsByQuestionIdHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			QuestionID int `json:"Question"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		options, err := appsql.SelectCorrectOptionsByQuestionId(db, request.QuestionID)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(options)
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

func GetOptionsByIdsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			IDs []int `json:"IDs"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		options, err := appsql.SelectOptionsByIds(db, request.IDs)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(options)
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

func PostOptionHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var option models.Option
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&option); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := appsql.InsertOption(db, option); err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		respondJSON(w, option)
	}
}
