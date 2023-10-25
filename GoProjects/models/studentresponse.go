package models

type StudentResponse struct {
	ID              int
	AttemptID       int
	Attempt         Attempt
	QuestionID      int
	Question        Question
	SelectedOptions []int
	IsCorrect       bool
}
