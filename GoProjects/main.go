package main

import (
	"fmt"
	"net/http"
	"project/routes"

	"github.com/gorilla/handlers"
	_ "github.com/lib/pq"
)

func main() {
	r := routes.SetupRouter()

	allowedOrigins := handlers.AllowedOrigins([]string{"http://localhost:3000"})
	allowedMethods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"})
	allowedHeaders := handlers.AllowedHeaders([]string{"Content-Type"})

	corsHandler := handlers.CORS(allowedOrigins, allowedMethods, allowedHeaders)(r)

	http.Handle("/", corsHandler)

	port := 8080
	fmt.Printf("Server is running on :%d...\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println(err)
	}
}
