const express = require('express');
const { createReservation, confirmReservation, getReservationsByMovie, getReservationById, getReservationsByUsername } = require('../controllers/reservationController');
const router = express.Router();

router.post('/movie/:movieUid/reservations', createReservation);
router.post('/:uid/confirm', confirmReservation);
router.get('/movie/:movieUid/reservations', getReservationsByMovie);
router.get('/:uid', getReservationById);
router.get('/username/:username', getReservationsByUsername);

module.exports = router;
