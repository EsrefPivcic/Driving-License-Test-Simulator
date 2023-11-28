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
	r.HandleFunc("/attempts/getbyuserid", handlers.RetrieveAttemptsByUserIdHandler(db))
	r.HandleFunc("/attempt/post", handlers.CreateAttemptHandler(db))
	r.HandleFunc("/attempt/submit", handlers.SubmitAttemptHandler(db))
	r.HandleFunc("/attempt/submitempty", handlers.SubmitEmptyAttemptHandler(db))
	r.HandleFunc("/users/get", handlers.RetrieveUsersHandler(db))
	r.HandleFunc("/user/getbytoken", handlers.RetrieveUserByTokenHandler(db))
	r.HandleFunc("/user/post", handlers.CreateUserHandler(db))
	r.HandleFunc("/user/changepassword", handlers.ChangePasswordHandler(db))
	r.HandleFunc("/user/changename", handlers.ChangeNameHandler(db))
	r.HandleFunc("/user/changesurname", handlers.ChangeSurnameHandler(db))
	r.HandleFunc("/user/changeusername", handlers.ChangeUsernameHandler(db))
	r.HandleFunc("/user/changeemail", handlers.ChangeEmailHandler(db))
	r.HandleFunc("/user/addprofileimage", handlers.AddProfileImageHandler(db))
	r.HandleFunc("/options/get", handlers.RetrieveOptionsHandler(db))
	r.HandleFunc("/options/getbyquestionids", handlers.RetrieveOptionsByQuestionIdsHandler(db))
	r.HandleFunc("/options/getcorrectbyquestionid", handlers.RetrieveCorrectOptionsByQuestionIdHandler(db))
	r.HandleFunc("/options/getbyids", handlers.RetrieveOptionsByIdsHandler(db))
	r.HandleFunc("/option/post", handlers.CreateOptionsHandler(db))
	r.HandleFunc("/userresponses/get", handlers.RetrieveUserResponsesHandler(db))
	r.HandleFunc("/userresponses/getbyattemptid", handlers.RetrieveUserResponsesByAttemptIdHandler(db))
	r.HandleFunc("/userresponse/post", handlers.CreateUserResponseHandler(db))
	r.HandleFunc("/login", handlers.AuthenticateHandler(db))
	r.HandleFunc("/logout", handlers.LogoutHandler(db))
	r.HandleFunc("/register", handlers.RegisterHandler(db))
	r.HandleFunc("/checktoken", handlers.CheckToken(db))
	r.HandleFunc("/hello", handlers.HelloHandler)
	r.HandleFunc("/", handlers.NotFoundHandler)

	return r
}
