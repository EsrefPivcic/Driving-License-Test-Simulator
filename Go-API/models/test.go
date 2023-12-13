package models

type Test struct {
	ID          int
	Title       string
	Description string
	Questions   []int
	Category    string
	Duration    int
	MaxScore    int
	IsVisible   bool
	Image       []byte
	ImageBase64 string
}
