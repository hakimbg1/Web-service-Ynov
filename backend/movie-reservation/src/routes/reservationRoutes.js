const express = require('express');
const { createReservation, confirmReservation, getReservationsByMovie, getReservationById } = require('../controllers/reservationController');
const router = express.Router();

router.post('/movie/:movieUid/reservations', createReservation); // user
router.post('/reservations/:uid/confirm', confirmReservation); // user
router.get('/movie/:movieUid/reservations', getReservationsByMovie); // user
router.get('/reservations/:uid', getReservationById); // user

module.exports = router;
