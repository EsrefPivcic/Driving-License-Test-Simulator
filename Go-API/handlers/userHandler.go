package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"project/dal"
	"project/utils"
)

func ChangePasswordHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token             string `json:"token"`
			OldPassword       string `json:"oldpassword"`
			NewPassword       string `json:"newpassword"`
			RepeatNewPassword string `json:"repeatnewpassword"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)
		log.Printf("ID=%d", studentID)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		student, err := dal.RetrieveStudentPasswordByIdFromDB(db, studentID)
		log.Printf("ID=%s", student.Password)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if !utils.ComparePasswords(student.Password, request.OldPassword) {
			http.Error(w, "Incorrect old password", http.StatusUnauthorized)
			return
		}

		if request.NewPassword != request.RepeatNewPassword {
			http.Error(w, "New passwords do not match", http.StatusBadRequest)
			return
		}

		hashedPassword, err := dal.HashPassword(request.NewPassword)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdatePasswordInDB(db, studentID, hashedPassword)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
