package models

type Question struct {
	ID             int
	QuestionText   string
	Image          []byte
	Points         int
	MultipleSelect bool
}
