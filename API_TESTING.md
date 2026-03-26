# API Testing Guide

## Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

## 📦 Products API

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Laptop",
  "price": 45000,
  "quantity": 100,
  "minStockLevel": 10,
  "description": "Dell Laptop"
}
```

### Get All Products
```http
GET /products
GET /products?search=laptop
GET /products?category=electronics
```

### Get Single Product
```http
GET /products/:id
```

### Update Product
```http
PUT /products/:id
Content-Type: application/json

{
  "name": "Gaming Laptop",
  "price": 50000
}
```

### Delete Product
```http
DELETE /products/:id
```

## 📊 Stock Management API

### Add Stock
```http
POST /stock/add
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 50,
  "reason": "New shipment"
}
```

### Remove Stock
```http
POST /stock/remove
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 10,
  "reason": "Sold"
}
```

### Get Low Stock Items
```http
GET /stock/low
```

### Get Total Stock Value
```http
GET /stock/value
```

## 🎤 Voice/NLP API

### Process Command
```http
POST /nlp/process-command
Content-Type: application/json

{
  "command": "Add 50 laptops"
}
```

**Response:**
```json
{
  "intent": {
    "action": "add_stock",
    "product_name": "laptops",
    "quantity": 50
  },
  "result": {
    "_id": "...",
    "name": "Laptop",
    "quantity": 150
  },
  "response": "Added 50 units to Laptop. New quantity: 150"
}
```

## 📈 Reports API

### Dashboard Stats
```http
GET /reports/dashboard
```

**Response:**
```json
{
  "totalProducts": 25,
  "lowStockCount": 3,
  "stockValue": 125000,
  "recentTransactions": [...]
}
```

### Transaction History
```http
GET /reports/transactions
GET /reports/transactions?productId=xxx
GET /reports/transactions?startDate=2024-01-01&endDate=2024-12-31
```

### Get Alerts
```http
GET /reports/alerts
```

### Dismiss Alert
```http
PUT /reports/alerts/:id/dismiss
```

## 🔐 Authentication API

### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Get Current User
```http
GET /auth/me
Authorization: Bearer your_jwt_token
```

## 🧪 Testing with cURL

```bash
# Create Product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Mouse","price":500,"quantity":50}'

# Get All Products
curl http://localhost:5000/api/products

# Add Stock
curl -X POST http://localhost:5000/api/stock/add \
  -H "Content-Type: application/json" \
  -d '{"productId":"xxx","quantity":10,"reason":"Restock"}'

# Process Voice Command
curl -X POST http://localhost:5000/api/nlp/process-command \
  -H "Content-Type: application/json" \
  -d '{"command":"Add 50 laptops"}'
```

## 📝 Voice Command Examples

```
"Add 50 laptops"
"Remove 10 chairs"
"Show me laptop details"
"List all products"
"Show low stock items"
"Create product phone with price 500"
"Update laptop price to 48000"
"Delete product keyboard"
```
