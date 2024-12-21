# Voucher Pool Project

![alt text](https://ibb.co/dW84RHZ)

## Overview

      This project is a Voucher Pool service built using **NestJS** and **TypeORM** with **PostgreSQL** as the database.
      The application provides an API for managing voucher codes, customers, and special offers.

      The project uses **Docker** for containerization, making it easy to set up the application with all its dependencies.

## Technologies Used

- **NestJS** - A progressive Node.js framework for building efficient and scalable server-side applications.
- **TypeORM** - A powerful ORM for Node.js and TypeScript, used for interacting with PostgreSQL.
- **PostgreSQL** - A relational database management system used for storing voucher, customer, and special offer data.
- **Docker** - Containerization for easy deployment and setup of the application and its dependencies.
- **SwaggerUI** - A documentation tool for documenting this application endpoint.

## Installation

### Clone the repository:

```
git clone https://github.com/your-username/voucher-pool.git
```

### Install dependencies:

```
npm install
```

### Set up environment variables:

      You need to set up the following environment variables in your `.env` file:

- `DB_HOST` - The PostgreSQL database host ip
- `DB_PORT` - The PostgreSQL database port
- `DB_NAME` - The PostgreSQL database name
- `DB_USER` - The PostgreSQL database username
- `DB_PASSWORD` - The PostgreSQL database password
- `NODE_ENV` - Your current env (e.g., **development**).
- `PORT` - Your current application port (e.g., **5000**).

### Docker Setup:

      To run the application using Docker, ensure you have Docker installed on your machine. You can use the following commands to build and run the Docker containers:

```
docker-compose up --build
```

      This command will set up the PostgreSQL database and the application in containers.

### Run the application:

```
npm run start:dev
```

## API Endpoints

### Generate Voucher

      [POST] /vouchers/generate

      Generate a voucher for a specific customer and offer.

#### Request Body:

```

      {
        "customerId": "123",
        "offerId": "1",
        "expirationDate": "2024-12-31T23:59:59Z"
      }

```

### Validate Voucher

      [POST] /vouchers/validate

      Validate a voucher code for a customer.

#### Request Body:

```

      {
        "email": "customer@example.com",
        "voucherCode": "VOUCH-1234"
      }

```

### Get Vouchers for Customer

      [GET] /vouchers/customer/:email

      Retrieve all valid vouchers for a specific customer.

### Get All Customers

      [GET] /customers

      Retrieve all customers in the database. This endpoint is only for observation purposes and does not allow any modification of customer records.

### Get All Offers

      [GET] /offers

      Retrieve all special offers in the database. This endpoint is only for observation purposes and does not allow any modification of offer records.

## Database Schema

### Entities:

#### Customer

- **id** (UUID, Primary Key)
- **name** (string)
- **email** (string, Unique)

#### SpecialOffer

- **id** (UUID, Primary Key)
- **name** (string)
- **discountPercentage** (number)

#### Voucher

- **id** (UUID, Primary Key)
- **code** (string, Unique)
- **expirationDate** (Date)
- **usageDate** (Date, Nullable)
- **isUsed** (boolean)
- **customer** (ForeignKey to Customer)
- **specialOffer** (ForeignKey to SpecialOffer)

## Running Migrations

      To run migrations, use the following command:

```
npm run migration:run
```

      To generate a new migration, use:

```
npm run migration:generate -- <migration-name></migration-name>
```

## Seeding the Database

      To seed the database with initial customers and offers, use the following command:

```
npm run seed
```

## Testing

      Unit tests are written using Jest. To run the tests, use the following command:

```
npm run test
```
