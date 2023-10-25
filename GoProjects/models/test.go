package models

import (
	"database/sql"
	"log"

	"github.com/lib/pq"
)

type Test struct {
	ID          int
	Title       string
	Description string
	Questions   []int
	Category    string
	Image       []byte
	Duration    int
}

func (o *Test) CreateInDBTest(db *sql.DB) error {
	questionArray := pq.Array(o.Questions)
	_, err := db.Exec("INSERT INTO Test (Title, Description, Questions, Category, Image, Duration) VALUES ($1, $2, $3, $4, NULL, $5)",
		o.Title, o.Description, questionArray, o.Category, o.Duration)
	if err != nil {
		log.Printf("Error inserting test into the database: %v", err)
		return err
	}
	return nil
}

func (o *Test) RetrieveFromDBTest(db *sql.DB) ([]Test, error) {
	rows, err := db.Query(`
        SELECT *
        FROM Test
    `)
	if err != nil {
		log.Printf("Error executing SQL query: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tests []Test

	for rows.Next() {
		var test Test
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
