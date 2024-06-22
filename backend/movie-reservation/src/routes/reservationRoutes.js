const express = require('express');
<<<<<<< HEAD
const { createReservation, confirmReservation, getReservationsByMovie, getReservationById, getReservationsByUsername } = require('../controllers/reservationController');
const router = express.Router();

router.post('/movie/:movieUid/reservations', createReservation);
router.post('/:uid/confirm', confirmReservation);
router.get('/movie/:movieUid/reservations', getReservationsByMovie);
router.get('/:uid', getReservationById);
router.get('/username/:username', getReservationsByUsername);
=======
const { createReservation, confirmReservation, getReservationsByMovie, getReservationById } = require('../controllers/reservationController');
const router = express.Router();

router.post('/movie/:movieUid/reservations', createReservation); // user
router.post('/reservations/:uid/confirm', confirmReservation); // user
router.get('/movie/:movieUid/reservations', getReservationsByMovie); // user
router.get('/reservations/:uid', getReservationById); // user
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

module.exports = router;
