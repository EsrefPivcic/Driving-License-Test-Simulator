package handlers

import (
	"io"
	"net/http"
	"os"
	"path/filepath"

	"github.com/google/uuid"
)

func UploadImageHandler(uploadDir string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		r.ParseMultipartForm(10 << 20) // 10 MB limit for image file size

		file, handler, err := r.FormFile("image")
		if err != nil {
			http.Error(w, "Failed to read image from form", http.StatusBadRequest)
			return
		}
		defer file.Close()

		// Generate a unique file name for the uploaded image
		imageName := uuid.New().String() + filepath.Ext(handler.Filename)

		// Create a new file on the server
		f, err := os.OpenFile(filepath.Join(uploadDir, imageName), os.O_WRONLY|os.O_CREATE, 0666)
		if err != nil {
			http.Error(w, "Failed to create file on the server", http.StatusInternalServerError)
			return
		}
		defer f.Close()

		// Copy the uploaded file data to the server file
		io.Copy(f, file)

		// Respond with the image file path and name
		imagePath := filepath.Join(uploadDir, imageName)

		response := struct {
			Image     string
			ImageName string
		}{
			Image:     imagePath,
			ImageName: imageName,
		}

		respondJSON(w, response)
	}
}
