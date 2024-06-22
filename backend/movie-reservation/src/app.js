const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const reservationRoutes = require('./routes/reservationRoutes');
const roomRoutes = require('./routes/roomRoutes');
const cinemaRoutes = require('./routes/cinemaRoutes');
<<<<<<< HEAD
const seanceRoutes = require('./routes/seanceRoutes');
=======
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

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

<<<<<<< HEAD
app.use('/reservation', reservationRoutes);
app.use('/rooms', roomRoutes);
app.use('/cinema', cinemaRoutes);
app.use('/sceances', seanceRoutes);
=======
app.use('/reservation', reservationRoutes); // Apply auth middleware for all reservation routes
app.use('/rooms', roomRoutes); // Apply auth middleware for all reservation routes
app.use('/cinema', cinemaRoutes); // Apply auth middleware for all reservation routes
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f


app.listen(3003, () => {
  console.log('Movie reservation service running on port 3003');
<<<<<<< HEAD
});
=======
});
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
