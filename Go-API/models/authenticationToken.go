package models

type AuthenticationToken struct {
	ID        int
	Value     string
	StudentID int
	Student   Student
}
