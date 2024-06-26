const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const movieRoutes = require('./routes/movieRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
<<<<<<< HEAD
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
=======
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve static files
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

// Routes
app.use('/', movieRoutes);

// Database connection
mongoose.connect('mongodb://mongo:27017/movie-app', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(error => console.error('Could not connect to MongoDB:', error));

// Start the server
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Movie service running on port ${port}`);
});
