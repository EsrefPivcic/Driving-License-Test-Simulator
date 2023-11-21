package handlers

import (
	"database/sql"
	"encoding/json"
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
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		student, err := dal.RetrieveStudentPasswordByIdFromDB(db, studentID)
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

func ChangeNameHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token   string `json:"token"`
			NewName string `json:"newname"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateNameInDB(db, studentID, request.NewName)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func ChangeSurnameHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token      string `json:"token"`
			NewSurname string `json:"newsurname"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateSurnameInDB(db, studentID, request.NewSurname)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func ChangeUsernameHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token       string `json:"token"`
			NewUsername string `json:"newusername"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateUsernameInDB(db, studentID, request.NewUsername)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}

func ChangeEmailHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token    string `json:"token"`
			NewEmail string `json:"newemail"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		studentID, err := dal.RetrieveStudentIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateEmailInDB(db, studentID, request.NewEmail)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
