const Reservation = require('../models/reservationModel');
const { v4: uuidv4 } = require('uuid');

const createReservation = async (req, res) => {
  try {
<<<<<<< HEAD
    const { movieUid, username ,sceance, nbSeats, room, rank, status, expiresAt } = req.body;
    const reservation = new Reservation({ uid: uuidv4(), movieUid, username ,sceance, nbSeats, room, rank, status, expiresAt }) ; // Expires in 15 minutes
=======
    const { sceance, nbSeats, room } = req.body;
    const reservation = new Reservation({ uid: uuidv4(), movieUid: req.params.movieUid, sceance, nbSeats, room, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }); // Expires in 15 minutes
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    await reservation.save();
    res.status(201).send(reservation);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

<<<<<<< HEAD

=======
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
const confirmReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ uid: req.params.uid });
    if (reservation && reservation.status === 'open' && reservation.expiresAt > new Date()) {
      reservation.status = 'confirmed';
      await reservation.save();
      res.status(200).send(reservation);
    } else if (reservation && reservation.expiresAt <= new Date()) {
      res.status(410).send({ message: 'Reservation expired' });
    } else {
      res.status(404).send({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationsByMovie = async (req, res) => {
  try {
<<<<<<< HEAD
    const reservations = await Reservation.find();
=======
    const reservations = await Reservation.find({ movieUid: req.params.movieUid });
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    res.status(200).send(reservations);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getReservationById = async (req, res) => {
  try {
    const reservation = await Reservation.findOne({ uid: req.params.uid });
    if (reservation) {
      res.status(200).send(reservation);
    } else {
      res.status(404).send({ message: 'Reservation not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

<<<<<<< HEAD
const getReservationsByUsername = async (req, res) => {
  try {
    const reservations = await Reservation.find({ username: req.params.username });
    if (reservations.length > 0) {
      res.status(200).send(reservations);
    } else {
      res.status(404).send({ message: 'No reservations found for this username' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createReservation, confirmReservation, getReservationsByMovie, getReservationById, getReservationsByUsername };
=======
module.exports = { createReservation, confirmReservation, getReservationsByMovie, getReservationById };
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
