package handlers

import (
	"database/sql"
	"encoding/base64"
	"encoding/json"
	"log"
	"net/http"
	"project/dal"
	"project/models"
)

func RetrieveUsersHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		users, err := dal.RetrieveFromDBUser(db)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(users)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}

func CreateUserHandler(db *sql.DB) http.HandlerFunc {
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
			http.Error(w, "Invalid image data", http.StatusBadRequest)
			return
		}
		user.Image = imageBytes

		if err := dal.CreateInDBUser(db, user); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, user)
	}
}

func AddProfileImageHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token       string `json:"token"`
			ImageBase64 string `json:"imagebase64"`
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

		user, err := dal.RetrieveUserByIdFromDB(db, userID)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		imageBase64 := request.ImageBase64
		imageBytes, err := base64.StdEncoding.DecodeString(imageBase64)
		if err != nil {
			http.Error(w, "Invalid image data", http.StatusBadRequest)
			return
		}
		user.Image = imageBytes

		err = dal.UpdateInDBUser(db, user)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, user)
	}
}

func RetrieveUserByTokenHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token string `json:"token"`
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

		user, err := dal.RetrieveUserByIdFromDB(db, userID)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		response, err := json.Marshal(user)
		if err != nil {
			log.Fatal(err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(response)
	}
}
