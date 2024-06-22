const mongoose = require('mongoose');
const { Schema } = mongoose;

const movieSchema = new Schema({
  uid: { type: String, required: true },
  name: { type: String, required: true, maxlength: 128 },
  description: { type: String, required: true, maxlength: 4096 },
  rate: { type: Number, required: true, min: 1, max: 5 },
  duration: { type: Number, required: true, min: 1, max: 240 },
  hasReservationsAvailable: { type: Boolean, default: false },
  pictureUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Movie', movieSchema);
