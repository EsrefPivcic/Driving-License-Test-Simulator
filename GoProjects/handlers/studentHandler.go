package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"
)

func RetrieveStudentsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query("SELECT * FROM Student")
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var students []models.Student

	for rows.Next() {
		var student models.Student
		err := rows.Scan(
			&student.ID,
			&student.Name,
			&student.Surname,
			&student.Username,
			&student.Email,
			&student.Password,
		)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		students = append(students, student)
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

func CreateStudentHandler(w http.ResponseWriter, r *http.Request) {
	var student models.Student
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&student); err != nil {
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

	_, err = db.Exec("INSERT INTO Student (Name, Surname, Username, Email, Password) VALUES ($1, $2, $3, $4, $5)",
		student.Name, student.Surname, student.Username, student.Email, student.Password)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, student)
}
