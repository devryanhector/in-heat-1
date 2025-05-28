# User Microservice

## Overview
The User Microservice manages user accounts and authentication in the TechGuru e-commerce platform. It provides user management functionality with support for multiple user types (buyer/seller/admin) and profile management capabilities.

## Features
- User registration and login
- Profile management
- Multi-role support (buyer/seller/admin)
- User search functionality
- Admin user management
- Event notifications for user actions
- Username uniqueness validation
- Basic profile information

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Message Broker**: CloudAMQP (RabbitMQ)
- **Port**: 3001

## Data Model
```json
User {
  "firstName": "string (required)",
  "middleName": "string (optional)",
  "lastName": "string (required)",
  "username": "string (required, unique)",
  "password": "string (required)",
  "userType": "string (enum: buyer, seller, admin)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## API Endpoints

### Register User
- **POST** `/users/register`
- **Body**:
```json
{
  "firstName": "string",
  "middleName": "string",
  "lastName": "string",
  "username": "string",
  "password": "string",
  "userType": "string"
}
```

### Login User
- **POST** `/users/login`
- **Body**:
```json
{
  "username": "string",
  "password": "string"
}
```

### Get User Profile
- **GET** `/users/:userId`

### Update User Profile
- **PUT** `/users/:userId`
- **Body**: Same as Register (partial updates allowed)

### Search Users
- **GET** `/users/search`
- **Query Parameters**:
  - `username`: Username to search for

### Get Users by Type
- **GET** `/users/type/:userType`

### Admin Endpoints
- **GET** `/users`: Get all users (admin only)
- **PUT** `/users/:userId/type`: Update user type (admin only)
- **DELETE** `/users/:userId`: Delete user (admin only)

## Event Communication

### Published Events
- `user.registered`: When a new user registers
- `user.updated`: When user details are updated
- `user.login`: When user logs in
- `user.type.updated`: When user type changes
- `user.deleted`: When user is deleted

## Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.3",
  "amqplib": "^0.10.3",
  "body-parser": "^1.20.2",
  "cors": "^2.8.5"
}
```

## Environment Variables
- `MONGODB_URL`: MongoDB connection string
- `RABBITMQ_URL`: RabbitMQ connection string
- `PORT`: Server port (default: 3001)

## Setup and Installation
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the service:
   ```bash
   npm start
   ```

3. Development mode:
   ```bash
   npm run dev
   ```

## Admin Functionality
- View all users
- Modify user types
- Delete users
- Monitor user activities
- Manage user permissions

## Error Handling
- Username uniqueness validation
- Input validation
- Admin permission checks
- Concurrent update handling
- Detailed error messages

## Health Check
- Endpoint: `GET /health`
- Response: `{ "status": "User Service is running" }`

## Notes
- This is a simplified implementation for educational purposes
- No password encryption implemented
- No session management
- Direct database and message broker connections
- Basic error handling and validation
- Supports admin operations for user management
