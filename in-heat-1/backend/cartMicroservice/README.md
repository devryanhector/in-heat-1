# Cart Microservice

## Overview
The Cart Microservice is responsible for managing shopping cart operations in the TechGuru e-commerce platform. It provides real-time cart management with multi-seller support and inventory validation.

## Features
- Add/remove items to/from cart
- Update item quantities
- Automatic cart total calculation
- Multi-seller cart support
- Real-time inventory validation
- Event notifications for cart actions
- Automatic cart cleanup

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Message Broker**: CloudAMQP (RabbitMQ)
- **Port**: 3003

## Data Model
```json
Cart {
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
  "totalAmount": "number (calculated)",
  "updatedAt": "timestamp"
}
```

## API Endpoints

### Add Item to Cart
- **POST** `/cart/add`
- **Body**:
```json
{
  "userId": "string",
  "productId": "string",
  "sellerId": "string",
  "quantity": "number",
  "price": "number",
  "name": "string"
}
```

### Remove Item from Cart
- **POST** `/cart/remove`
- **Body**:
```json
{
  "userId": "string",
  "productId": "string"
}
```

### Update Item Quantity
- **PUT** `/cart/update`
- **Body**:
```json
{
  "userId": "string",
  "productId": "string",
  "quantity": "number"
}
```

### Get Cart Contents
- **GET** `/cart/:userId`

### Clear Cart
- **DELETE** `/cart/:userId`

## Event Communication

### Published Events
- `cart.item.added`: When an item is added to cart
- `cart.item.removed`: When an item is removed from cart
- `cart.item.updated`: When item quantity is updated
- `cart.cleared`: When a cart is cleared

### Subscribed Events
- `product.updated`: Updates cart when product details change
- `product.deleted`: Removes deleted products from carts

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
- `PORT`: Server port (default: 3003)

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

## Error Handling
- Validates product existence before adding to cart
- Checks seller ID matches product
- Validates quantity is available
- Handles concurrent cart updates
- Provides detailed error messages

## Health Check
- Endpoint: `GET /health`
- Response: `{ "status": "Cart Service is running" }`

## Notes
- This is a simplified implementation for educational purposes
- No authentication/authorization implemented
- Direct database and message broker connections
- Basic error handling and validation
