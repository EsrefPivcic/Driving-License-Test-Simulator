package models

type User struct {
	ID          int
	Name        string
	Surname     string
	Username    string
	Email       string
	Password    string
	Image       []byte
	ImageBase64 string
	IsStudent   bool
	IsAdmin     bool
}
