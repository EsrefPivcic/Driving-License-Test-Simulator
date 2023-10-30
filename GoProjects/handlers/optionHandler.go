package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveOptionsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		options, err := (&models.Option{}).RetrieveFromDB(db)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(options)
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

func CreateOptionsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var option models.Option
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&option); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		if err := option.CreateInDBOption(db); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, option)
	}
}
