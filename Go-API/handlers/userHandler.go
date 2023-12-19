package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"project/appsql"
	"project/authUtils"
	"project/models"
)

func GetUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		users, err := appsql.SelectUsersAll(db)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(users)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}

func PostUserHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var user models.User
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&user); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		imageBase64 := user.ImageBase64
		imageBytes, err := base64.StdEncoding.DecodeString(imageBase64)
		if err != nil {
			http.Error(w, "Invalid image data.", http.StatusBadRequest)
			return
		}
		user.Image = imageBytes

		if err := appsql.InsertUser(db, user); err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		respondJSON(w, user)
	}
}

func PostProfileImageHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token       string `json:"token"`
			ImageBase64 string `json:"imagebase64"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		user, err := appsql.SelectUserById(db, userID)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		imageBase64 := request.ImageBase64
		imageBytes, err := base64.StdEncoding.DecodeString(imageBase64)
		if err != nil {
			http.Error(w, "Invalid image data.", http.StatusBadRequest)
			return
		}
		user.Image = imageBytes

		err = appsql.UpdateUser(db, user)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		respondJSON(w, user)
	}
}

func GetUserByTokenHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token string `json:"token"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		user, err := appsql.SelectUserById(db, userID)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(user)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}

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
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		user, err := appsql.SelectUserPasswordById(db, userID)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		if !authUtils.ComparePasswords(user.Password, request.OldPassword) {
			http.Error(w, "Incorrect old password.", http.StatusUnauthorized)
			return
		}

		if request.NewPassword != request.RepeatNewPassword {
			http.Error(w, "New passwords do not match.", http.StatusBadRequest)
			return
		}

		hashedPassword, err := authUtils.HashPassword(request.NewPassword)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		err = appsql.UpdateUserPassword(db, userID, hashedPassword)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
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
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		err = appsql.UpdateUserName(db, userID, request.NewName)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
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
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		err = appsql.UpdateUserSurname(db, userID, request.NewSurname)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
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
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		err = appsql.UpdateUserUsername(db, userID, request.NewUsername)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
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
			http.Error(w, "Invalid request body.", http.StatusBadRequest)
			return
		}

		userID, err := appsql.SelectUserIdByToken(db, request.Token)

		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		err = appsql.UpdateUserEmail(db, userID, request.NewEmail)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
	}
}
