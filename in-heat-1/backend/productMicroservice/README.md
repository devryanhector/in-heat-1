# Product Microservice

## Overview
The Product Microservice manages the product catalog in the TechGuru e-commerce platform. It provides comprehensive product management capabilities with support for multiple sellers, image handling, and advanced search functionality.

## Features
- Complete product CRUD operations
- Advanced search and filtering
- Category management
- Multi-seller support
- Image handling (base64)
- Inventory management
- Real-time product updates
- Admin product moderation

## Technical Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **Message Broker**: CloudAMQP (RabbitMQ)
- **Port**: 3002

## Data Model
```json
Product {
  "sellerId": "string (required)",
  "name": "string (required)",
  "description": "string (required)",
  "images": ["string (base64)"],
  "price": "number (required, min: 0)",
  "quantity": "number (required, min: 0)",
  "category": "string (required)",
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## API Endpoints

### Create Product
- **POST** `/products`
- **Body**:
```json
{
  "sellerId": "string",
  "name": "string",
  "description": "string",
  "images": ["string (base64)"],
  "price": "number",
  "quantity": "number",
  "category": "string"
}
```

### List All Products
- **GET** `/products`

### Search Products
- **GET** `/products/search`
- **Query Parameters**:
  - `query`: Search text
  - `sellerUsername`: Filter by seller
  - `category`: Filter by category
  - `minPrice`: Minimum price
  - `maxPrice`: Maximum price

### Get Product Details
- **GET** `/products/:productId`

### Update Product
- **PUT** `/products/:productId`
- **Body**: Same as Create Product

### Delete Product
- **DELETE** `/products/:productId`
- **Headers**: `user-id: string (seller/admin ID)`

### Get Seller's Products
- **GET** `/products/seller/:sellerId`

## Event Communication

### Published Events
- `product.created`: When a new product is added
- `product.updated`: When a product is modified
- `product.deleted`: When a product is removed
- `product.quantity.updated`: When stock changes

### Subscribed Events
- `user.updated`: Updates seller information
- `user.deleted`: Handles seller removal

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
- `PORT`: Server port (default: 3002)

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

## Search Functionality
- Text search on name, description, and category
- Price range filtering
- Category filtering
- Seller filtering
- Sort by relevance or date
- Only shows products with available stock

## Image Handling
- Supports multiple images per product
- Base64 encoding
- Image validation
- 10MB size limit per request
- Automatic format validation

## Error Handling
- Validates seller ownership
- Checks admin permissions
- Validates image formats
- Handles concurrent updates
- Provides detailed error messages

## Health Check
- Endpoint: `GET /health`
- Response: `{ "status": "Product Service is running" }`

## Notes
- This is a simplified implementation for educational purposes
- No authentication/authorization implemented
- Direct database and message broker connections
- Basic error handling and validation
- Supports admin operations for product management
