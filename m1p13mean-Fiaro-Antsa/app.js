const express = require('express');
const cors = require('cors');

const adminRoutes = require('./routes/adminRoutes');
const customerRoutes = require('./routes/customerRoutes');
const shopRoutes = require('./routes/shopRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admins', adminRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/shops', shopRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message });
});

module.exports = app;
