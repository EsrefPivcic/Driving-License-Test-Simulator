package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"project/appsql"
	"project/authUtils"
	"project/models"
)

func LoginHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest models.LoginRequest
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&loginRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		password, userid, err := appsql.SelectUserPasswordByUsername(db, loginRequest.Username)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		valid := authUtils.ComparePasswords(password, loginRequest.Password)

		if !valid {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		token, err := authUtils.GenerateToken(loginRequest.Username)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if err := appsql.InsertToken(db, userid, token); err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, map[string]string{"token": token})
	}
}

func CheckTokenHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var request struct {
			Token string `json:"token"`
		}

		err := json.NewDecoder(r.Body).Decode(&request)
		if err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		exists, err := appsql.CountToken(db, request.Token)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, exists)
	}
}
