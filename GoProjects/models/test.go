package models

type Test struct {
	ID          int
	Title       string
	Description string
	Questions   []int
	Category    string
	Image       []byte
	Duration    int
	ImageBase64 string `json:"image,omitempty"`
}
