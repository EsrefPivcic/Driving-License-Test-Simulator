# eDrivingSchool

Welcome to the eDrivingSchool project! This application aims to provide a realistic simulation of tests for obtaining a driver's license, covering various vehicle categories such as cars, motorbikes, and more. Currently a work in progress, we are utilizing the Go language for the backend and React for the frontend.

## Getting Started

To get started with the project, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/NedzmijaMuminovic/eDrivingSchool
    ```

2. Navigate to the project directory:

    ```bash
    cd eDrivingSchool
    ```

3. Open the project in VS Code:

    ```bash
    code .
    ```

4. Navigate to the Go API directory, install dependencies and run the backend:

    ```bash
    cd Go-API
    go get
    go run main.go
    ```

5. Navigate to the React App directory, install dependencies, and run the frontend:

    ```bash
    cd ../React-App
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
