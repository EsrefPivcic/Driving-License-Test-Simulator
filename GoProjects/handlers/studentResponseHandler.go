package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveStudentResponsesHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

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

func CreateStudentResponseHandler(w http.ResponseWriter, r *http.Request) {
	var studentresponse models.StudentResponse
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&studentresponse); err != nil {
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

	if err := studentresponse.CreateInDBStudentResponse(db); err != nil {
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, studentresponse)
}
