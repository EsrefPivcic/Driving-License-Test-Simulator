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
    cd eDrivingSchool/Docker-Compose
    ```

3. Run Docker Compose to set up the database:

    ```bash
    docker-compose up
    ```

4. After the database is set up, navigate to the Go API directory in a new terminal window:

    ```bash
    cd eDrivingSchool/Go-API
    ```

5. Install database migration tool for Go:
   
    ```bash
    go install -tags 'postgres' github.com/golang-migrate/migrate/v4/cmd/migrate@latest
    ```

6. Perform migrations to populate the database with data:

   ```bash
    migrate -database "postgres://admin:admin@localhost:5432/eDrivingSchoolDB?sslmode=disable" -path migrations up
    ```

7. Install dependencies and run the backend:

    ```bash
    go get
    go run main.go
    ```

8. Open the React App directory in a new terminal window:

    ```bash
    cd eDrivingSchool/React-App
    ```

9. Install dependencies and start the frontend:

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

- **Homepage:** The app features a homepage with different tests categorized by vehicle types.

- **Test Categories:** Each category, such as cars or motorbikes, contains a set of questions for simulation.

- **Quiz-like Interface:** Users can go through the questions and select their answers, simulating a real driving test experience.

- **Test Taking:** Take timed tests and receive immediate feedback on whether you passed or failed, along with explanations.

## Admin Functionalities
- Admins can add new tests with new questions and options, enhancing the variety of simulated driving scenarios.

Thank you for your interest in our eDrivingSchool project! Happy coding!

## Screenshots
### User Functionalities
![Screenshot 1](Screenshots/1.png)
![Screenshot 2](Screenshots/2.png)
![Screenshot 3](Screenshots/3.png)
![Screenshot 4](Screenshots/4.png)
![Screenshot 5](Screenshots/5.png)
![Screenshot 6](Screenshots/6.png)
![Screenshot 7](Screenshots/7.png)
![Screenshot 8](Screenshots/8.png)

### Administrator Functionalities
![Screenshot 9](Screenshots/9.png)
