package models

type Test struct {
	ID          int
	Title       string
	Description string
	Questions   []int
	Category    string
	Duration    int
	Image       []byte
	ImageBase64 string
}
