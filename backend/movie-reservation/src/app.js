const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const reservationRoutes = require('./routes/reservationRoutes');
const roomRoutes = require('./routes/roomRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');

const app = express();
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/movie-reservation', { useNewUrlParser: true, useUnifiedTopology: true });

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  try {
    const response = await axios.post('http://auth-service:3001/auth/verify', { token });
    req.user = response.data;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};

app.use('/reservation', reservationRoutes); // Apply auth middleware for all reservation routes
app.use('/rooms', roomRoutes); // Apply auth middleware for all reservation routes
app.use('/cinema', cinemaRoutes); // Apply auth middleware for all reservation routes


app.listen(3003, () => {
  console.log('Movie reservation service running on port 3003');
});
