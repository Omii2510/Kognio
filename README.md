# Kognio — AI-Powered Inventory Management System

A full-stack inventory management system with AI-powered chat, smart stock alerts, invoice generation, and analytics dashboard.

---

## Tech Stack

**Frontend**
- React 18 + Vite
- Tailwind CSS
- Recharts / Chart.js
- Framer Motion
- React Router DOM

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Nodemailer
- Groq SDK (AI Chat)

---

## Features

- 🤖 AI Chat Assistant for inventory queries
- 📦 Product & Category Management
- 📊 Analytics Dashboard with charts
- 🔔 Low Stock Alerts
- 🧾 Invoice Generation (PDF export)
- 📈 Stock Transaction History
- 🔐 Auth with JWT (Login, Register, Forgot Password)

---

## Getting Started

### Prerequisites
- Node.js >= 18
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repo
```bash
git clone https://github.com/Omii2510/Kognio.git
cd Kognio
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=5000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
GROQ_API_KEY=<your_groq_api_key>
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_password>
```

```bash
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Deployment

This project is configured for **Vercel** deployment (`vercel.json` included in both `frontend/` and `backend/`).

- Deploy backend and frontend as separate Vercel projects
- Use [MongoDB Atlas](https://www.mongodb.com/atlas) for the database

---

## Project Structure

```
Kognio/
├── backend/
│   ├── config/        # Database connection
│   ├── controllers/   # Route controllers
│   ├── middleware/    # Auth & error handling
│   ├── models/        # Mongoose models
│   ├── routes/        # API routes
│   ├── services/      # Business logic & AI services
│   └── server.js
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── services/
│       └── App.jsx
```

---

## License

MIT
