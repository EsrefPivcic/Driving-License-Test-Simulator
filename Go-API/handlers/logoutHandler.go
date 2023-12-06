package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"project/appsql"
	"project/models"
	"sync"
)

var invalidatedTokens = make(map[string]bool)
var mutex = &sync.Mutex{}

func LogoutHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var logoutRequest models.LogoutRequest
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&logoutRequest); err != nil {
			http.Error(w, err.Error(), http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		mutex.Lock()
		invalidatedTokens[logoutRequest.Token] = true
		mutex.Unlock()

		err := appsql.DeleteToken(db, logoutRequest.Token)
		if err != nil {
			http.Error(w, "Error deleting token", http.StatusInternalServerError)
			return
		}

		respondJSON(w, map[string]string{"message": "Logout successful"})
	}
}
