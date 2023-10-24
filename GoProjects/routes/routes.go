package routes

import (
	"project/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/questions", handlers.RetrieveQuestionsHandler)
	r.HandleFunc("/create-question", handlers.CreateQuestionHandler)
	r.HandleFunc("/tests", handlers.RetrieveTestsHandler)
	r.HandleFunc("/create-test", handlers.CreateTestHandler)
	r.HandleFunc("/options/get", handlers.RetrieveOptionsHandler)
	r.HandleFunc("/option/post", handlers.CreateOptionsHandler)
	r.HandleFunc("/userresponses/get", handlers.RetrieveUserResponsesHandler)
	r.HandleFunc("/userresponse/post", handlers.CreateUserResponseHandler)
	r.HandleFunc("/hello", handlers.HelloHandler)
	r.HandleFunc("/", handlers.NotFoundHandler)

	return r
}
