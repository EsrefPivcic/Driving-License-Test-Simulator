package services

import (
	"database/sql"
	"log"
	"math"
	"project/appsql"
	"project/models"
)

func CalculateTestPass(db *sql.DB, responses []models.UserResponse, testID int, token string) (models.Attempt, []models.UserResponse) {
	var Score int = 0
	var attempt models.Attempt
	test, err := appsql.SelectTestById(db, testID)
	if err != nil {
		log.Printf("Error retrieving test: %v", err)
	}
	var responsesquestionids []int
	for i := 0; i < len(responses); i++ {
		responsesquestionids = append(responsesquestionids, responses[i].QuestionID)
	}
	var responsesquestions []models.Question
	responsesquestions, err = appsql.SelectQuestionsByIds(db, responsesquestionids)
	if err != nil {
		log.Printf("Error retrieving questions for responses: %v", err)
	}
	for i := 0; i < len(responses); i++ {
		var question = responsesquestions[i]
		result, err2 := CheckUserResponseCorrect(db, responses[i])
		if err2 != nil {
			log.Printf("Error checking userResponses: %v", err2)
		}
		responses[i].IsCorrect = false
		if result {
			responses[i].IsCorrect = true
			Score += question.Points
		}
	}
	var percentage = float64(Score) / float64(test.MaxScore) * float64(100)
	if percentage < float64(90) {
		attempt.Passed = false
	}
	if percentage >= float64(90) {
		attempt.Passed = true
	}
	percentageFloat := float64(percentage)
	userID, err := appsql.SelectUserIdByToken(db, token)
	if err != nil {
		log.Printf("Error retrieving a UserID: %v", err)
	}
	attempt.UserID = userID
	attempt.TestID = testID
	attempt.Score = Score
	attempt.MaxScore = test.MaxScore
	attempt.Percentage = math.Round(percentageFloat)
	return attempt, responses
}
