package services

import (
	"database/sql"
	"log"
	"project/dal"
	"project/models"
)

func CalculateTestPass(db *sql.DB, responses []models.StudentResponse, testID int) (models.Attempt, []models.StudentResponse) {
	var MaxScore int = 0
	var Score int = 0
	var attempt models.Attempt
	for i := 0; i < len(responses); i++ {
		var question, err1 = dal.RetrieveQuestionByIdFromDB(db, responses[i].QuestionID)
		if err1 != nil {
			log.Printf("error: %v", err1)
		}
		result, err2 := CheckStudentResponseCorrect(db, responses[i])
		if err2 != nil {
			log.Printf("error: %v", err2)
		}
		MaxScore += question.Points
		responses[i].IsCorrect = false
		if result {
			responses[i].IsCorrect = true
			Score += question.Points
		}
	}
	var percentage = Score / MaxScore * 100
	if percentage < 90 {
		attempt.Passed = false
	}
	if percentage >= 90 {
		attempt.Passed = true
	}
	percentageInt := int(percentage)
	attempt.StudentID = 3
	attempt.TestID = testID
	attempt.Score = Score
	attempt.MaxScore = MaxScore
	attempt.Percentage = percentageInt
	return attempt, responses
}
