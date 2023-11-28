package models

type Attempt struct {
	ID         int
	UserID     int
	User       User
	TestID     int
	Test       Test
	Score      int
	Passed     bool
	MaxScore   int
	Percentage float64
}
