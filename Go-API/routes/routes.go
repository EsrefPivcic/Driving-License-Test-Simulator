package routes

import (
	"database/sql"
	"project/handlers"

	"github.com/gorilla/mux"
)

func SetupRouter(db *sql.DB) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/questions/get", handlers.GetQuestionsHandler(db))
	r.HandleFunc("/questions/getbyids", handlers.GetQuestionsByIdsHandler(db))
	r.HandleFunc("/question/post", handlers.PostQuestionHandler(db))
	r.HandleFunc("/tests/get", handlers.GetTestsHandler(db))
	r.HandleFunc("/tests/getvisible", handlers.GetTestsVisibleHandler(db))
	r.HandleFunc("/test/getbyid", handlers.GetTestByIdHandler(db))
	r.HandleFunc("/test/post", handlers.PostTestHandler(db))
	r.HandleFunc("/test/updatevisibility", handlers.UpdateTestVisibilityHandler(db))
	r.HandleFunc("/attempts/get", handlers.GetAttemptsHandler(db))
	r.HandleFunc("/attempts/getbyuserid", handlers.GetAttemptsByUserIdHandler(db))
	r.HandleFunc("/attempt/post", handlers.PostAttemptHandler(db))
	r.HandleFunc("/attempt/submit", handlers.SubmitAttemptHandler(db))
	r.HandleFunc("/attempt/submitempty", handlers.SubmitEmptyAttemptHandler(db))
	r.HandleFunc("/users/get", handlers.GetUsersHandler(db))
	r.HandleFunc("/user/getbytoken", handlers.GetUserByTokenHandler(db))
	r.HandleFunc("/user/post", handlers.PostUserHandler(db))
	r.HandleFunc("/user/changepassword", handlers.ChangePasswordHandler(db))
	r.HandleFunc("/user/changename", handlers.ChangeNameHandler(db))
	r.HandleFunc("/user/changesurname", handlers.ChangeSurnameHandler(db))
	r.HandleFunc("/user/changeusername", handlers.ChangeUsernameHandler(db))
	r.HandleFunc("/user/changeemail", handlers.ChangeEmailHandler(db))
	r.HandleFunc("/user/addprofileimage", handlers.PostProfileImageHandler(db))
	r.HandleFunc("/options/get", handlers.GetOptionsHandler(db))
	r.HandleFunc("/options/getbyquestionids", handlers.GetOptionsByQuestionIdsHandler(db))
	r.HandleFunc("/options/getcorrectbyquestionid", handlers.GetCorrectOptionsByQuestionIdHandler(db))
	r.HandleFunc("/options/getbyids", handlers.GetOptionsByIdsHandler(db))
	r.HandleFunc("/option/post", handlers.PostOptionHandler(db))
	r.HandleFunc("/userresponses/get", handlers.GetUserResponsesHandler(db))
	r.HandleFunc("/userresponses/getbyattemptid", handlers.GetUserResponsesByAttemptIdHandler(db))
	r.HandleFunc("/userresponse/post", handlers.PostUserResponseHandler(db))
	r.HandleFunc("/login", handlers.LoginHandler(db))
	r.HandleFunc("/logout", handlers.LogoutHandler(db))
	r.HandleFunc("/register", handlers.RegisterHandler(db))
	r.HandleFunc("/checktoken", handlers.CheckTokenHandler(db))
	r.HandleFunc("/hello", handlers.HelloHandler)
	r.HandleFunc("/", handlers.NotFoundHandler)

	return r
}
