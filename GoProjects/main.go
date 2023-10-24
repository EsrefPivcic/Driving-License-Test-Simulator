package main

import (
	"fmt"
	"net/http"
	"project/routes"

	_ "github.com/lib/pq"
)

func main() {
	r := routes.SetupRouter()
	http.Handle("/", r)

	port := 8080
	fmt.Printf("Server is running on :%d...\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%d", port), nil)
	if err != nil {
		fmt.Println(err)
	}
}
