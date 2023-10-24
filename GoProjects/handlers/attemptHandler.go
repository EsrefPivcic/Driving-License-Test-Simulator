package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"

	"github.com/lib/pq"
)

func RetrieveAttemptsHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
        SELECT
            a.ID AS AttemptID,
			a.StudentID AS AttemptStudentID,
			a.TestID AS AttemptTestID,
			a.Score AS Score,
            a.Passed AS Passed,
            s.ID AS StudentID,
			s.Name AS Name,
			s.Surname AS Surname,
			s.Username AS Username,
			s.Email AS Email,
			s.Password AS Password,
            t.ID AS TestID,
			t.Title AS Title,
			t.Description AS Description,
			t.Questions AS Question,
			t.Category AS Category,
			t.Image AS Image,
			t.Duration AS Duration
        FROM Attempt AS a
        INNER JOIN Student AS s ON a.StudentID = s.ID
		INNER JOIN Test AS t ON a.TestID = t.ID
    `)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var attempts []models.Attempt

	for rows.Next() {
		var attempt models.Attempt
		var student models.Student
		var test models.Test

		var questionArray pq.Int64Array

		err := rows.Scan(
			&attempt.ID,
			&attempt.StudentID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&student.ID,
			&student.Name,
			&student.Surname,
			&student.Username,
			&student.Email,
			&student.Password,
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

		attempt.Student = student
		attempt.Test = test
		attempts = append(attempts, attempt)
	}

	response, err := json.Marshal(attempts)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func CreateAttemptHandler(w http.ResponseWriter, r *http.Request) {
	var attempt models.Attempt
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&attempt); err != nil {
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

	_, err = db.Exec("INSERT INTO Attempt (StudentID, TestID, Score, Passed) VALUES ($1, $2, $3, $4)",
		attempt.StudentID, attempt.TestID, attempt.Score, attempt.Passed)

	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, attempt)
}
