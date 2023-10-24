package routes

import (
	"project/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/questions/get", handlers.RetrieveQuestionsHandler)
	r.HandleFunc("/question/post", handlers.CreateQuestionHandler)
	r.HandleFunc("/tests/get", handlers.RetrieveTestsHandler)
	r.HandleFunc("/test/post", handlers.CreateTestHandler)
	r.HandleFunc("/attempts/get", handlers.RetrieveAttemptsHandler)
	r.HandleFunc("/attempt/post", handlers.CreateAttemptHandler)
	r.HandleFunc("/students/get", handlers.RetrieveStudentsHandler)
	r.HandleFunc("/student/post", handlers.CreateStudentHandler)
	r.HandleFunc("/options/get", handlers.RetrieveOptionsHandler)
	r.HandleFunc("/option/post", handlers.CreateOptionsHandler)
	r.HandleFunc("/userresponses/get", handlers.RetrieveUserResponsesHandler)
	r.HandleFunc("/userresponse/post", handlers.CreateUserResponseHandler)
	r.HandleFunc("/hello", handlers.HelloHandler)
	r.HandleFunc("/", handlers.NotFoundHandler)

	return r
}
