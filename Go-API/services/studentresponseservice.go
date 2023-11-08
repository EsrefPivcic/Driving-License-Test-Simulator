package services

import (
	"database/sql"
	"project/dal"
	"project/models"
)

func CheckStudentResponseCorrect(db *sql.DB, response models.StudentResponse) (bool, error) {
	selectedOptions, err := dal.RetrieveOptionsByIdsFromDB(db, response.SelectedOptions)
	if err != nil {
		return false, err
	}

	correctOptions, err := dal.RetrieveCorrectOptionsByQuestionIdFromDB(db, response.QuestionID)
	if err != nil {
		return false, err
	}

	for _, selectedOption := range selectedOptions {
		if !containsOption(correctOptions, selectedOption) {
			return false, nil
		}
	}

	if len(selectedOptions) < len(correctOptions) {
		return false, nil
	}
	return true, nil
}

func containsOption(options []models.Option, target models.Option) bool {
	for _, option := range options {
		if option.ID == target.ID {
			return true
		}
	}
	return false
}
