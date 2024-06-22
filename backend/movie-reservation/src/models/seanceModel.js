const mongoose = require('mongoose');

const seanceSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  roomUids: [{ type: String, required: true }],
  movie: { type: String, required: true },
  date: { type: Date, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Seance', seanceSchema);