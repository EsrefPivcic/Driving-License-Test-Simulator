package routes

import (
	"database/sql"
	"project/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter(db *sql.DB) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/questions/get", handlers.RetrieveQuestionsHandler(db))
	r.HandleFunc("/questions/getbyids", handlers.RetrieveQuestionsByIdsHandler(db))
	r.HandleFunc("/question/post", handlers.CreateQuestionHandler(db))
	r.HandleFunc("/tests/get", handlers.RetrieveTestsHandler(db))
	r.HandleFunc("/test/getbyid", handlers.RetrieveTestByIdHandler(db))
	r.HandleFunc("/test/post", handlers.CreateTestHandler(db))
	r.HandleFunc("/attempts/get", handlers.RetrieveAttemptsHandler(db))
	r.HandleFunc("/attempt/post", handlers.CreateAttemptHandler(db))
	r.HandleFunc("/attempt/submit", handlers.SubmitAttemptHandler(db))
	r.HandleFunc("/students/get", handlers.RetrieveStudentsHandler(db))
	r.HandleFunc("/student/getbytoken", handlers.RetrieveStudentByTokenHandler(db))
	r.HandleFunc("/student/post", handlers.CreateStudentHandler(db))
	r.HandleFunc("/user/changepassword", handlers.ChangePasswordHandler(db))
	r.HandleFunc("/options/get", handlers.RetrieveOptionsHandler(db))
	r.HandleFunc("/options/getbyquestionids", handlers.RetrieveOptionsByQuestionIdsHandler(db))
	r.HandleFunc("/options/getcorrectbyquestionid", handlers.RetrieveCorrectOptionsByQuestionIdHandler(db))
	r.HandleFunc("/options/getbyids", handlers.RetrieveOptionsByIdsHandler(db))
	r.HandleFunc("/option/post", handlers.CreateOptionsHandler(db))
	r.HandleFunc("/studentresponses/get", handlers.RetrieveStudentResponsesHandler(db))
	r.HandleFunc("/studentresponses/getbyattemptid", handlers.RetrieveStudentResponsesByAttemptIdHandler(db))
	r.HandleFunc("/studentresponse/post", handlers.CreateStudentResponseHandler(db))
	r.HandleFunc("/login", handlers.AuthenticateHandler(db))
	r.HandleFunc("/logout", handlers.LogoutHandler(db))
	r.HandleFunc("/register", handlers.RegisterHandler(db))
	r.HandleFunc("/checktoken", handlers.CheckToken(db))
	r.HandleFunc("/hello", handlers.HelloHandler)
	r.HandleFunc("/", handlers.NotFoundHandler)

	return r
}
