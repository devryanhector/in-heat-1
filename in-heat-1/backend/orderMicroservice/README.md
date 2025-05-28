# Order Microservice

## Overview
The Order Microservice handles order processing and management in the TechGuru e-commerce platform. It manages the complete order lifecycle from creation to completion, with support for multi-seller orders and real-time inventory synchronization.

## Features
- Order creation from cart contents
- Order status management (pending/confirmed/completed)
- Multi-seller order support
- Real-time inventory synchronization
- Order history tracking
- Seller-specific order views
- Admin order management
- Event-driven updates

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Message Broker**: CloudAMQP (RabbitMQ)
- **Port**: 3004

## Data Model
```json
Order {
  "userId": "string (required)",
  "items": [
    {
      "productId": "string (required)",
      "sellerId": "string (required)",
      "quantity": "number (min: 1)",
      "price": "number (min: 0)",
      "name": "string (required)"
    }
  ],
  "totalAmount": "number (required, min: 0)",
  "status": "string (enum: pending, confirmed, completed)",
  "orderDate": "timestamp",
  "updatedAt": "timestamp"
}
```

## API Endpoints

### Create Order
- **POST** `/orders/create`
- **Body**:
```json
{
  "userId": "string",
  "items": [
    {
      "productId": "string",
      "sellerId": "string",
      "quantity": "number",
      "price": "number",
      "name": "string"
    }
  ],
  "totalAmount": "number"
}
```

### Get Order Details
- **GET** `/orders/:orderId`

### Get User's Orders
- **GET** `/orders/user/:userId`

### Get Seller's Orders
- **GET** `/orders/seller/:sellerId`

### Update Order Status
- **PUT** `/orders/:orderId/status`
- **Body**:
```json
{
  "status": "string (pending/confirmed/completed)"
}
```

### Get All Orders (Admin)
- **GET** `/orders`
- **Headers**: `user-id: string (admin user ID)`

## Event Communication

### Published Events
- `order.created`: When a new order is created
- `order.confirmed`: When an order is confirmed
- `order.completed`: When an order is completed

### Subscribed Events
- `cart.cleared`: Updates inventory after order creation
- `product.updated`: Validates product availability

## Dependencies
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.6.3",
  "amqplib": "^0.10.3",
  "body-parser": "^1.20.2",
  "cors": "^2.8.5",
  "node-fetch": "^2.6.7"
}
```

## Environment Variables
- `MONGODB_URL`: MongoDB connection string
- `RABBITMQ_URL`: RabbitMQ connection string
- `PORT`: Server port (default: 3004)

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

## Business Logic
- Validates product availability before order creation
- Updates product inventory on order creation
- Verifies seller ownership of products
- Calculates order totals
- Manages order status transitions
- Handles multi-seller orders

## Error Handling
- Validates product existence and quantity
- Checks seller authorization
- Handles concurrent order processing
- Validates order status transitions
- Provides detailed error messages

## Health Check
- Endpoint: `GET /health`
- Response: `{ "status": "Order Service is running" }`

## Notes
- This is a simplified implementation for educational purposes
- No authentication/authorization implemented
- Direct database and message broker connections
- Basic error handling and validation
- Supports admin operations for order management
