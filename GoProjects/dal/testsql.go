package dal

import (
	"database/sql"
	"log"
	"project/models"

	"github.com/lib/pq"
)

func CreateInDBTest(db *sql.DB, t models.Test) error {
	questionArray := pq.Array(t.Questions)
	_, err := db.Exec("INSERT INTO Test (Title, Description, Questions, Category, Image, Duration) VALUES ($1, $2, $3, $4, NULL, $5)",
		t.Title, t.Description, questionArray, t.Category, t.Duration)
	if err != nil {
		log.Printf("Error inserting test into the database: %v", err)
		return err
	}
	return nil
}

func RetrieveFromDBTest(db *sql.DB) ([]models.Test, error) {
	rows, err := db.Query(`
        SELECT *
        FROM Test
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tests []models.Test

	for rows.Next() {
		var test models.Test
		var questionArray pq.Int64Array

		err := rows.Scan(
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Image,
			&test.Duration,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		tests = append(tests, test)
	}

	return tests, nil
}
