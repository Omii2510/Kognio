# AI Smart Inventory - AI-Powered Inventory Management System
**  Live Project Link:  https://smart-inventory-ai.vercel.app/**

A full-stack MERN application with voice command capabilities for managing inventory using natural language processing.

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)

## ✨ Features

- 🔐 User Authentication (JWT)
- 📦 Product Management (CRUD)
- 📊 Real-time Dashboard with Analytics
- 🎤 Voice Commands (Speech Recognition + NLP)
- 📈 Stock Management (Add/Remove/Adjust)
- 🔔 Low Stock Alerts
- 📋 Transaction History
- 📊 Reports & Analytics
- 🤖 AI-Powered Command Processing (Groq AI)

## 🛠️ Tech Stack

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Groq AI (llama-3.3-70b-versatile)

**Frontend:**
- React 18 + Vite
- React Router
- Axios
- Web Speech API

## 📋 Prerequisites

- Node.js (v16+)
- MongoDB Atlas account
- Groq API Key ([Get it here](https://console.groq.com))

## 🚀 Installation

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=llama-3.3-70b-versatile
NODE_ENV=development
```

4. Start the server:
```bash
npm run dev
```
✅ Backend running on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```
✅ Frontend running on http://localhost:3000

## 📱 Usage

1. Open http://localhost:3000
2. Navigate to different sections:
   - **Dashboard** - View inventory stats and recent activities
   - **Products** - Manage products (Add, Edit, Delete)
   - **Stock** - Add or remove stock
   - **Voice** - Use voice commands
   - **Chat** - Type commands and chat with AI assistant
   - **Reports** - View transaction history and alerts

## 🎤 Voice Commands Examples

```
"Add 50 laptops"
"Remove 10 chairs"
"Show me laptop details"
"List all products"
"Show low stock items"
"Create product phone with price 500"
"Update laptop price to 48000"
```

## 🔌 API Endpoints

### Products
- `POST /api/products` - Create product
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Stock Management
- `POST /api/stock/add` - Add stock
- `POST /api/stock/remove` - Remove stock
- `GET /api/stock/low` - Get low stock items
- `GET /api/stock/value` - Get total stock value

### Voice/NLP
- `POST /api/nlp/process-command` - Process voice command

### Reports
- `GET /api/reports/dashboard` - Dashboard stats
- `GET /api/reports/transactions` - Transaction history
- `GET /api/reports/alerts` - Active alerts
- `PUT /api/reports/alerts/:id/dismiss` - Dismiss alert

## 📁 Project Structure

```
ai-smart-inventory/
├── backend/
│   ├── config/          # Database configuration
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── services/        # Business logic (NLP, Alerts)
│   └── server.js        # Entry point
│
└── frontend/
    └── src/
        ├── components/  # React components
        │   ├── auth/
        │   ├── dashboard/
        │   ├── products/
        │   ├── stock/
        │   ├── voice/
        │   └── reports/
        ├── context/     # Context providers
        ├── services/    # API services
        ├── hooks/       # Custom hooks
        └── App.jsx      # Main app component
```

## 🧪 Testing

See [API_TESTING.md](API_TESTING.md) for detailed API testing guide.

## 🚀 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## 📝 License

MIT

## 👨‍💻 Author

Your Name

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## ⭐ Show your support

Give a ⭐️ if this project helped you!
