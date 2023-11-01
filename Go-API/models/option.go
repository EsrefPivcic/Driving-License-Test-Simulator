package models

type Option struct {
	ID         int
	QuestionID int
	Question   Question
	OptionText string
	IsCorrect  bool
}
