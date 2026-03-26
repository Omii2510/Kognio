require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');
const invoiceRoutes = require("./routes/invoice");
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/stock', require('./routes/stock'));
app.use('/api/nlp', require('./routes/nlp'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/reports', require('./routes/reports'));
app.use("/api/invoices", invoiceRoutes);

// Error handler
app.use(errorHandler);

// Add root route for Vercel
app.get('/', (req, res) => {
  res.json({ message: 'VoiceStock API is running!' });
});

// Add debug route
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      GROQ_API_KEY: process.env.GROQ_API_KEY ? 'Set' : 'Not set'
    },
    timestamp: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for Vercel
module.exports = app;
