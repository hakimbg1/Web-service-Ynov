const Reservation = require('../models/reservationModel');
const { v4: uuidv4 } = require('uuid');

const createReservation = async (req, res) => {
  try {
    const { sceance, nbSeats, room } = req.body;
    const reservation = new Reservation({ uid: uuidv4(), movieUid: req.params.movieUid, sceance, nbSeats, room, expiresAt: new Date(Date.now() + 15 * 60 * 1000) }); // Expires in 15 minutes
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
    const reservations = await Reservation.find({ movieUid: req.params.movieUid });
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

module.exports = { createReservation, confirmReservation, getReservationsByMovie, getReservationById };
