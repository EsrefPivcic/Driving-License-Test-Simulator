package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"project/routes"

	"github.com/gorilla/handlers"
	_ "github.com/lib/pq"
)

func ConnectDB() (*sql.DB, error) {
	connectionString := "user=admin password=admin dbname=eDrivingSchoolDB host=localhost port=5432 sslmode=disable"
	db, err := sql.Open("postgres", connectionString)
	if err != nil {
		return nil, err
	}
	return db, nil
}

func main() {
	db, err := ConnectDB()
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	r := routes.SetupRouter(db)

	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

	corsHandler := handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(r)

	http.Handle("/", corsHandler)

	port := 8080
	fmt.Printf("Server is running on :%d...\n", port)
	err2 := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err2 != nil {
		fmt.Println(err2)
	}
}
