package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"project/models"

	"github.com/lib/pq"
)

func RetrieveUserResponsesHandler(w http.ResponseWriter, r *http.Request) {
	db, err := connectDB()
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer db.Close()

	rows, err := db.Query(`
    SELECT
        ur.ID AS UserResponseID,
        ur.AttemptID AS UserResponseAttemptID,
        ur.QuestionID AS UserResponseQuestionID,
        ur.SelectedOptions AS SelectedOptions,
        ur.IsCorrect AS IsCorrect,
        a.ID AS AttemptID,
		a.StudentID AS AttemptStudentID,
		a.TestID AS AttemptTestID,
		a.Score as AttemptScore,
		a.Passed as AttemptPassed,
		q.ID as QuestionID,
		q.QuestionText as QuestionText,
        q.Image AS Image,
        q.Points AS Points,
        q.MultipleSelect AS MultipleSelect
    FROM UserResponse AS ur
    INNER JOIN Attempt AS a ON ur.AttemptID = a.ID
	INNER JOIN Question AS q ON ur.QuestionID = q.ID
`)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var userresponses []models.UserResponse

	for rows.Next() {
		var userresponse models.UserResponse
		var attempt models.Attempt
		var question models.Question
		var optionsArray pq.Int64Array
		err := rows.Scan(
			&userresponse.ID,
			&userresponse.AttemptID,
			&userresponse.QuestionID,
			&optionsArray,
			&userresponse.IsCorrect,
			&attempt.ID,
			&attempt.StudentID,
			&attempt.TestID,
			&attempt.Score,
			&attempt.Passed,
			&question.ID,
			&question.QuestionText,
			&question.Image,
			&question.Points,
			&question.MultipleSelect,
		)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		userresponse.SelectedOptions = make([]int, len(optionsArray))
		for i, val := range optionsArray {
			userresponse.SelectedOptions[i] = int(val)
		}

		userresponse.Attempt = attempt
		userresponse.Question = question
		userresponses = append(userresponses, userresponse)
	}

	response, err := json.Marshal(userresponses)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(response)
}

func CreateUserResponseHandler(w http.ResponseWriter, r *http.Request) {
	var userresponse models.UserResponse
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&userresponse); err != nil {
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

	optionsArray := pq.Array(userresponse.SelectedOptions)
	_, err = db.Exec("INSERT INTO UserResponse (AttemptID, QuestionID, SelectedOptions, IsCorrect) VALUES ($1, $2, $3, $4)",
		userresponse.AttemptID, userresponse.QuestionID, optionsArray, userresponse.IsCorrect)
	if err != nil {
		log.Fatal(err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	respondJSON(w, userresponse)
}
