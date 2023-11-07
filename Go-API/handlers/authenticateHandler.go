package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"project/dal"
	"project/models"
	"project/utils"
)

func AuthenticateHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var loginRequest models.LoginRequest
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&loginRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		valid, err := dal.ValidateCredentials(db, loginRequest.Username, loginRequest.Password)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		if !valid {
			http.Error(w, "Invalid credentials", http.StatusUnauthorized)
			return
		}

		token, err := utils.GenerateToken(loginRequest.Username)
		if err != nil {
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		respondJSON(w, map[string]string{"token": token})
	}
}
