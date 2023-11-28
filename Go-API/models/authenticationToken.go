package models

type AuthenticationToken struct {
	ID     int
	Value  string
	UserID int
	User   User
}
