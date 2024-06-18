const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  uid: String,
  movieUid: String,
  sceance: Date,
  nbSeats: Number,
  room: String,
  rank: Number,
  status: String,
  expiresAt: Date,
});

// Ensure index is created
reservationSchema.index({ uid: 1 }, { unique: true });

const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;
