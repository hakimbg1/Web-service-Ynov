const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  cinemaUid: { type: String, required: true },
  name: { type: String, required: true, maxlength: 128 },
  seats: { type: Number, required: true, min: 1 }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
