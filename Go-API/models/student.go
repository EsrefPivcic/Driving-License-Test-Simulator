package models

type Student struct {
	ID          int
	Name        string
	Surname     string
	Username    string
	Email       string
	Password    string
	Image       []byte
	ImageBase64 string
}
