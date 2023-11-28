package services

import (
	"database/sql"
	"log"
	"math"
	"project/dal"
	"project/models"
)

func CalculateTestPass(db *sql.DB, responses []models.UserResponse, testID int, token string) (models.Attempt, []models.UserResponse) {
	var MaxScore int = 0
	var Score int = 0
	var attempt models.Attempt
	test, err := dal.RetrieveTestByIdFromDB(db, testID)
	if err != nil {
		log.Printf("Error retrieving Test: %v", err)
	}
	questions, errq := dal.RetrieveQuestionsByIdsFromDB(db, test.Questions)
	if errq != nil {
		log.Printf("Error retrieving Questions: %v", errq)
	}
	for i := 0; i < len(questions); i++ {
		MaxScore += questions[i].Points
	}
	for i := 0; i < len(responses); i++ {
		var question, err1 = dal.RetrieveQuestionByIdFromDB(db, responses[i].QuestionID)
		if err1 != nil {
			log.Printf("Error retrieving QuestionID: %v", err1)
		}
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
	var percentage = float64(Score) / float64(MaxScore) * float64(100)
	if percentage < float64(90) {
		attempt.Passed = false
	}
	if percentage >= float64(90) {
		attempt.Passed = true
	}
	percentageFloat := float64(percentage)
	userID, err := dal.RetrieveUserIDByTokenFromDB(db, token)
	if err != nil {
		log.Printf("Error retrieving a UserID: %v", err)
	}
	attempt.UserID = userID
	attempt.TestID = testID
	attempt.Score = Score
	attempt.MaxScore = MaxScore
	attempt.Percentage = math.Round(percentageFloat)
	return attempt, responses
}
