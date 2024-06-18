const mongoose = require('mongoose');

const cinemaSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String, required: true, maxlength: 128 }
}, { timestamps: true });

module.exports = mongoose.model('Cinema', cinemaSchema);
