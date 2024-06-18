const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  movieUid: { type: String, required: true },
  sceance: { type: Date, required: true },
  nbSeats: { type: Number, required: true },
  room: { type: String, required: true },
  rank: { type: Number, required: true, min: 0 },
  status: { type: String, enum: ['open', 'expired', 'confirmed'], default: 'open' },
  expiresAt: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);