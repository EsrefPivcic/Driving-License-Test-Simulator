package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"project/appsql"
	"project/models"
)

func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var registrationRequest models.RegistrationRequest
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&registrationRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		exists, err := appsql.CountUser(db, registrationRequest.Username, registrationRequest.Email)
		if err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}
		if exists {
			http.Error(w, "Username or email already exists.", http.StatusConflict)
			return
		}

		user := models.User{
			Name:      registrationRequest.Name,
			Surname:   registrationRequest.Surname,
			Username:  registrationRequest.Username,
			Email:     registrationRequest.Email,
			Password:  registrationRequest.Password,
			Image:     nil,
			IsStudent: true,
			IsAdmin:   false,
		}

		if err := appsql.InsertUser(db, user); err != nil {
			http.Error(w, "Internal server error.", http.StatusInternalServerError)
			return
		}

		respondJSON(w, user)
	}
}
