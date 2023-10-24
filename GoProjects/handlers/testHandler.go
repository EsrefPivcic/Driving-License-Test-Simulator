package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"

	"github.com/lib/pq"
)

func RetrieveTestsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Test")
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var tests []models.Test

	for rows.Next() {
		var test models.Test
		var questionArray pq.Int64Array

		err := rows.Scan(
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Image,
			&test.Duration,
		)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		tests = append(tests, test)
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

func CreateTestHandler(w http.ResponseWriter, r *http.Request) {
	var test models.Test
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&test); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	questionArray := pq.Array(test.Questions)
	_, err = db.Exec("INSERT INTO Test (Title, Description, Questions, Category, Image, Duration) VALUES ($1, $2, $3, $4, NULL, $5)",
		test.Title, test.Description, questionArray, test.Category, test.Duration)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, test)
}
