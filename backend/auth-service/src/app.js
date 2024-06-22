const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(cors());
<<<<<<< HEAD
app.use(express.json());
=======
app.use(express.json()); // This should be enough for JSON parsing
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

// Routes
app.use('/', authRoutes);

// Database connection
mongoose.connect('mongodb://mongo:27017/movie-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));

// Start the server
app.listen(3001, () => {
  console.log('Auth service running on port 3001');
});
