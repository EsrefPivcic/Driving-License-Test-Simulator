package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"project/dal"
	"project/models"
)

func RetrieveTestsHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		tests, err := dal.RetrieveFromDBTest(db)
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

func CreateTestHandler(db *sql.DB) http.HandlerFunc {
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

		if err := dal.CreateInDBTest(db, test); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, test)
	}
}
