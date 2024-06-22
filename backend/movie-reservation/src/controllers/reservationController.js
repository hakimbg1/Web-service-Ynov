const Reservation = require('../models/reservationModel');
const { v4: uuidv4 } = require('uuid');

const createReservation = async (req, res) => {
  try {
    const { movieUid, username ,sceance, nbSeats, room, rank, status, expiresAt } = req.body;
    const reservation = new Reservation({ uid: uuidv4(), movieUid, username ,sceance, nbSeats, room, rank, status, expiresAt }) ; // Expires in 15 minutes
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
    const reservations = await Reservation.find();
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
