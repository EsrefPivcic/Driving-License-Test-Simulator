package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
)

func HelloHandler(w http.ResponseWriter, r *http.Request) {
	//fmt.Fprint(w, "Hello, World!\n\n")

	w.Header().Set("Content-Type", "application/json")
	response := map[string]string{"message": "Hello, World!"}
	respondJSON(w, response)
}

func NotFoundHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusNotFound)
	response := map[string]string{"error": "Page Not Found"}
	respondJSON(w, response)
}

func connectDB() (*sql.DB, error) {
	connectionString := "user=postgres password=12345 dbname=dlts host=localhost port=5432 sslmode=disable"
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func respondJSON(w http.ResponseWriter, data interface{}) {
	//fmt.Fprint(w, data)

	enc := json.NewEncoder(w)
	if err := enc.Encode(data); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
