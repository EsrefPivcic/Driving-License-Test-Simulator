# eDrivingSchool

Welcome to the eDrivingSchool project! This application aims to provide a realistic simulation of tests for obtaining a driver's license, covering various vehicle categories such as cars, motorbikes, and more.

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

4. After the database is set up, navigate to the Go API directory in a new terminal window:

    ```bash
    cd eDrivingSchool/Go-API
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

## User Authentication
To access the app, you need to log in. Use the following credentials:

Basic User: 
- Username: "user"
- Password: "user"

Admin: 
- Username: "admin" 
- Password: "admin"

Alternatively, create your own profile by clicking on the register option.
 
## Project Structure

The project is organized into two main components:

- **Backend (Go):** The backend logic is written in Go, providing the necessary APIs and data for the frontend.

- **Frontend (React):** The user interface is developed using React, presenting a user-friendly experience for taking driving tests.

## Features

- **Homepage:** The app currently features a homepage with different tests categorized by vehicle types.

- **Test Categories:** Each category, such as cars or motorbikes, contains a set of questions for simulation.

- **Quiz-like Interface:** Users can go through the questions and select their answers, simulating a real driving test experience.

- **Test Taking:** Take timed tests and receive immediate feedback on whether you passed or failed, along with explanations.

## Admin Functionalities
- Admins can add new tests with new questions and options, enhancing the variety of simulated driving scenarios.

Thank you for your interest in our eDrivingSchool project! Happy coding!
