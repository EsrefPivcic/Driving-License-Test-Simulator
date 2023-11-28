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

		userID, err := dal.RetrieveUserIDByTokenFromDB(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		user, err := dal.RetrieveUserPasswordByIdFromDB(db, userID)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if !utils.ComparePasswords(user.Password, request.OldPassword) {
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

		err = dal.UpdatePasswordInDB(db, userID, hashedPassword)
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

		userID, err := dal.RetrieveUserIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateNameInDB(db, userID, request.NewName)
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

		userID, err := dal.RetrieveUserIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateSurnameInDB(db, userID, request.NewSurname)
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

		userID, err := dal.RetrieveUserIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateUsernameInDB(db, userID, request.NewUsername)
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

		userID, err := dal.RetrieveUserIDByTokenFromDB(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		err = dal.UpdateEmailInDB(db, userID, request.NewEmail)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
