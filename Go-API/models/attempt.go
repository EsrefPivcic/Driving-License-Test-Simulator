package models

type Attempt struct {
	ID        int
	StudentID int
	Student   Student
	TestID    int
	Test      Test
	Score     int
	Passed    bool
}
