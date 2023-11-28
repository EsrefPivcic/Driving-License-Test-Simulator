package models

type UserResponse struct {
	ID              int
	AttemptID       int
	Attempt         Attempt
	QuestionID      int
	Question        Question
	SelectedOptions []int
	IsCorrect       bool
}
