# eDrivingSchool

Welcome to the eDrivingSchool project! This application aims to provide a realistic simulation of tests for obtaining a driver's license, covering various vehicle categories such as cars, motorbikes, and more. Currently a work in progress, we are utilizing the Go language for the backend and React for the frontend.

## Getting Started

To get started with the project, follow these steps in your terminal:

1. Clone the repository:

    ```bash
    git clone https://github.com/NedzmijaMuminovic/eDrivingSchool
    ```

2. Navigate to the Docker Compose directory:

    ```bash
    cd eDrivingSchool/Docker-compose
    ```

3. Run Docker Compose to set up the database:

    ```bash
    docker-compose up
    ```

4. After the database is set up, navigate to the Go API directory:

    ```bash
    cd ../Go-API
    ```

5. Perform migrations to populate the database with data:

   ```bash
    migrate -database "postgres://admin:admin@localhost:5432/eDrivingSchoolDB?sslmode=disable" -path migrations up
    ```

6. Install dependencies and run the backend:

    ```bash
    go get
    go run main.go
    ```

7. Open the React App directory in a new terminal window:

    ```bash
    cd eDrivingSchool/React-App
    ```

8. Install dependencies and start the frontend:

    ```bash
    npm install
    npm start
    ```
 
## Project Structure

The project is organized into two main components:

- **Backend (Go):** The backend logic is written in Go, providing the necessary APIs and data for the frontend.

- **Frontend (React):** The user interface is developed using React, presenting a user-friendly experience for taking driving tests.

## Features

- **Homepage:** The app currently features a homepage with different tests categorized by vehicle types.

- **Test Categories:** Each category, such as cars or motorbikes, contains a set of questions for simulation.

- **Quiz-like Interface:** Users can go through the questions and select their answers, simulating a real driving test experience.

Thank you for your interest in our eDrivingSchool project! Stay tuned for updates and happy coding!
