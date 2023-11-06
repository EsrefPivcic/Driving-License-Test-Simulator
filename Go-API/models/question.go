package models

type Question struct {
	ID             int
	QuestionText   string
	Points         int
	MultipleSelect bool
	Image          []byte
	ImageBase64    string
}
