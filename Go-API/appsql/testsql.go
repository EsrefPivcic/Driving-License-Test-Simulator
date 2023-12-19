package appsql

import (
	"database/sql"
	"encoding/base64"
	"log"
	"project/models"

	"github.com/lib/pq"
)

func InsertTest(db *sql.DB, t models.Test) error {
	questionArray := pq.Array(t.Questions)
	imageArray := pq.ByteaArray([][]byte{t.Image})
	_, err := db.Exec("INSERT INTO \"test\" (Title, Description, Questions, Category, Duration, MaxScore, IsVisible, Image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
		t.Title, t.Description, questionArray, t.Category, t.Duration, t.MaxScore, t.IsVisible, imageArray)

	if err != nil {
		log.Printf("Error inserting test into the database: %v", err)
		return err
	}
	return nil
}

func UpdateTestVisibility(db *sql.DB, testID int, isvisible bool) error {
	_, err := db.Exec("UPDATE \"test\" SET IsVisible = $2 WHERE ID = $1", testID, isvisible)

	if err != nil {
		log.Printf("Error updating test visibility in the database: %v", err)
		return err
	}
	return nil
}

func SelectTestsAll(db *sql.DB) ([]models.Test, error) {
	rows, err := db.Query("SELECT * FROM \"test\" ORDER BY test.ID;")
	if err != nil {
		log.Printf("Error selecting all tests: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tests []models.Test

	for rows.Next() {
		var test models.Test
		var questionArray pq.Int64Array
		var imageArray pq.ByteaArray

		err := rows.Scan(
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Duration,
			&test.MaxScore,
			&test.IsVisible,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		test.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		tests = append(tests, test)
	}

	return tests, nil
}

func SelectTestsVisible(db *sql.DB) ([]models.Test, error) {
	rows, err := db.Query(`
		SELECT
	    t.ID AS TestID,
	    t.Title AS Title,
	    t.Description AS Description,
	    t.Questions AS Questions,
	    t.Category AS Category,
	    t.Duration AS Duration,
	    t.MaxScore AS MaxScore,
	    t.Image AS Image
	FROM Test AS t
	WHERE t.IsVisible = TRUE
	ORDER BY t.ID;
	`)
	if err != nil {
		log.Printf("Error selecting visible tests: %v", err)
		return nil, err
	}
	defer rows.Close()

	var tests []models.Test

	for rows.Next() {
		var test models.Test
		var questionArray pq.Int64Array
		var imageArray pq.ByteaArray

		err := rows.Scan(
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Duration,
			&test.MaxScore,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return nil, err
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		test.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)

		tests = append(tests, test)
	}

	return tests, nil
}

func SelectTestById(db *sql.DB, testID int) (models.Test, error) {
	id := testID

	query := "SELECT * FROM \"test\" WHERE id = $1"
	rows, err := db.Query(query, id)
	if err != nil {
		log.Printf("Error selecting test by id: %v", err)
		return models.Test{}, err
	}
	defer rows.Close()

	var test models.Test
	var questionArray pq.Int64Array
	var imageArray pq.ByteaArray
	if rows.Next() {

		err := rows.Scan(
			&test.ID,
			&test.Title,
			&test.Description,
			&questionArray,
			&test.Category,
			&test.Duration,
			&test.MaxScore,
			&test.IsVisible,
			&imageArray,
		)
		if err != nil {
			log.Fatal(err)
			return models.Test{}, err
		}

		test.Questions = make([]int, len(questionArray))
		for i, val := range questionArray {
			test.Questions[i] = int(val)
		}

		var imageBytes []byte
		for _, chunk := range imageArray {
			imageBytes = append(imageBytes, chunk...)
		}

		test.ImageBase64 = base64.StdEncoding.EncodeToString(imageBytes)
	}

	return test, nil
}
