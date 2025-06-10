# Yoga Application
An online platform for managing yoga sessions where users can register, participate in, or leave sessions.

The back-end (Java, Spring Boot) includes unit and integration tests using JUnit 5, Mockito, and an embedded H2 database. The front-end (Angular) uses Jest for unit and integration tests, while end-to-end testing is handled with Cypress. Test coverage exceeds 80%, with integration tests covering at least 30%.

This project was generated with Angular CLI 14.1.0. Coverage reports can be generated as described below.

## Table of Contents

1.  Prerequisites  

2.  Clone the Project from GitHub

3.  Database Setup

4. Set Environment Variables

5.  Back-end Setup

6.  Front-end Setup
  
7.  Testing the Application Manually

8. Running the Tests and Generating Coverage Reports 

9. Resources

10. Technologies, Frameworks, and Libraries Used for Testing
    

## 1. Prerequisites

Before running the application, you need to have the following tools installed on your machine:

-   **Node.js** (version 16)  
    To check if Node.js is already installed, run: `node -v`
    
-   **Angular CLI** (version 14)  
    To install Angular CLI globally, run the following command: `npm install -g @angular/cli`  
      
-   **MySQL** (for database setup)  
    To check if MySQL is installed, run: `mysql --version`
    
-   **Java 11** (required for running the back-end)  
    To check if Java is installed, run:  `java -version`
    
-   **Maven** (for managing Java dependencies)  
    To check if Maven is installed, run: `mvn -v`

## 2. Clone the Project from GitHub

- Open your terminal or command prompt. Clone the GitHub repository of the project using the following command:

  `git clone https://github.com/Erika-Belicova/yoga`

  Replace `username` and `repository-name` with your GitHub username and the project name, respectively.

- Navigate to the cloned project directory:

  `cd repository-name`

  You will see two main folders:

  -   **back** for the Spring Boot back-end application
  -   **front** for the Angular front-end application  

## 3. Database Setup

Make sure MySQL is installed and running.

- #### Create the Database

  Run the following commands in your MySQL client:

  ```
  CREATE DATABASE yoga_db;
  USE yoga_db;
  ```

- #### Initialize the Database

  Run the SQL script located at:

  `ressources/sql/script.sql`

  In MySQL Workbench: Open the file and execute it.

  In MySQL Command Line: Run `source path/to/script.sql;`

  Replace path/to/script.sql with the full file path.

## 4. Set Environment Variables

This section explains how to set up environment variables for the database connection and JWT authentication.

### Set Environment Variables for Database Connection

Set your MySQL credentials as environment variables:

```
DATABASE_USERNAME=your_mysql_username
DATABASE_PASSWORD=your_mysql_password
```

Use your actual MySQL username and password.

The application reads these variables automatically to connect to the database.

### Configure the Application to Connect to MySQL
You need to ensure that Spring Boot is connected to the database. This is done through the **application.properties** file.
  
In **back/src/main/resources/application.properties**, ensure the database configuration is correct.
  
The configuration should look like this:  
  
```
spring.datasource.url=jdbc:mysql://localhost:3306/yoga_db?allowPublicKeyRetrieval=true
spring.datasource.username=${DATABASE_USERNAME}
spring.datasource.password=${DATABASE_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
```

-   Make sure the name `yoga_db` matches the database you created earlier.
-   The **\${DATABASE_USERNAME}** and **\${DATABASE_PASSWORD}** values will be loaded from your system environment variables.
-   MySQL must be running for the back-end to connect to the database. Otherwise, the database connection will fail.

____________

### Set JWT Secret Key as an Environment Variable

The app uses JWT for authentication. You must define a secret key as an environment variable to sign and verify tokens securely:

`JWT_SECRET_KEY=your_jwt_secret_key`

You can generate a 256-bit key using a tool like [generate-random.org](https://generate-random.org/encryption-key-generator).

Ensure your **application.properties** includes:

```
oc.app.jwtSecret=${JWT_SECRET_KEY}
oc.app.jwtExpirationMs=86400000
```

## 5. Back-end Setup

- Navigate to the back-end project directory:

  `cd back`

- Install the back-end dependencies using Maven:

  `mvn clean install`

## 6. Front-end Setup

The front-end part of this project has been pre-configured, and you can run it alongside the back-end for a fully functional application.

- Navigate to the front-end project directory:  
  
  `cd front`

- Install the front-end dependencies:  

  `npm install`

## 7. Testing the Application Manually

### Start the Back-end Application

  - Navigate to the back-end project directory:

    `cd back`

  - Once the dependencies are installed, start the back-end Spring Boot application with:

    `mvn spring-boot:run`

  The back-end API will be available at http://localhost:3001.

### Start the Front-end Application  

  - Navigate to the front-end project directory:  
  
    `cd front`

  - Once the dependencies are installed, start the front-end Angular application with:
  
    `npm run start`

  The Angular application will now be available at http://localhost:4200.  

_________________________________

### Open your browser and navigate to:
  
http://localhost:4200

You can log in with the pre-existing admin account:
```
Email: yoga@studio.com
Password: test!1234
```

## 8. Running the Tests and Generating Coverage Reports

### Run the Back-end Unit Tests

- Navigate to the back-end project directory:
  
  `cd back`

- Run the unit tests for the back-end application with:
  
  `mvn clean test`

  The test log is visible in the console. The integrated H2 database is preconfigured and used automatically during testing.

### Generate the Back-end Coverage Reports

- Run both unit and integration tests, and generate separate coverage reports via JaCoCo with:
  
  `mvn clean verify`

- Open the folder **target/site** in your file explorer.

  The following coverage reports are generated by JaCoCo for all tests and for integration tests separately:

  - All tests (unit + integration):

    `back/target/site/jacoco-merged-test-coverage-report/index.html`

  - Integration tests:

    `back/target/site/jacoco-integration-test-coverage-report/index.html`

  Open the **index.html** files in a browser to view the coverage reports.

_________________
  
### Run the Front-end Tests

- Navigate to the front-end project directory:
   
  `cd front`

- Run the tests for the front-end application with:
  
  `npm run test`

  The test log will be visible in the console.

### Access the Front-end Coverage Report

- Open the folder **front/coverage** in your file explorer. The coverage report for Jest is accessible here:
  
  `front/coverage/jest/lcov-report/index.html`

  Open **index.html** in a browser to view the coverage report.
  
___________________________

### Run the End-to-End Tests (E2E)

- Navigate to the front-end project directory:  
  
  `cd front`

- Run the end-to-end tests:

  `ng e2e`

  Cypress will open a browser and prompt you to select a compatible browser (Chrome recommended).

- Select a browser and click the button `Start E2E Testing in Chrome`.

  In the Cypress window, under E2E specs, click a test suite file (e.g., `app.cy.ts`) to run the tests. A new window opens where the tests will execute. To run other suites, select files from the left panel by clicking on the file name.

### Generate the End-to-End Coverage Report

- Navigate to the front-end project directory:  
  
  `cd front`

- Run the e2e tests in headless mode:

  `npm run e2e`

- After the test execution, generate the coverage report with:

  `npm run e2e:coverage`

- Open the folder **front/coverage** in your file explorer. The coverage report for Cypress is accessible here: 

  `front/coverage/lcov-report/index.html`

  Open **index.html** in a browser to view the coverage report.

## 9. Resources

### Postman collection

For Postman, import the following collection:

`ressources/postman/yoga.postman_collection.json`

To do so, you can follow the [Postman documentation on importing data](https://learning.postman.com/docs/getting-started/importing-and-exporting-data/#importing-data-into-postman).

Use this to manually test the API endpoints.

## 10. Technologies, Frameworks, and Libraries Used for Testing

### Back-end Testing:

-   **H2:** Relational database used for fast, in-memory testing during development.

-   **JUnit 5:** Java testing library used to write and run unit tests.

-   **Mockito:** Java mocking library used to create mocks and spies to simulate and verify behavior in unit tests.

- **JaCoCo:** Java code coverage library used to measure how much of the code is covered by tests.

### Front-end Testing:

-   **Jest:** JavaScript testing library used to write and run unit tests.

-   **Cypress:** End-to-end testing framework used to test web application behavior through real browser interactions.

- **Istanbul:** Code coverage library used to track how much of the JavaScript code is executed during testing.
