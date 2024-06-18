const Room = require('../models/roomModel');
const { v4: uuidv4 } = require('uuid');

const createRoom = async (req, res) => {
  try {
    const { cinemaUid, name, seats } = req.body;
    const room = new Room({ uid: uuidv4(), cinemaUid, name, seats });
    await room.save();
    res.status(201).send(room);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const getRoomsByCinema = async (req, res) => {
  try {
    const rooms = await Room.find({ cinemaUid: req.params.cinemaUid });
    res.status(200).send(rooms);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getRoom = async (req, res) => {
  try {
    const room = await Room.findOne({ uid: req.params.uid });
    if (room) {
      res.status(200).send(room);
    } else {
      res.status(404).send({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateRoom = async (req, res) => {
  try {
    const { name, seats } = req.body;
    const room = await Room.findOneAndUpdate(
      { uid: req.params.uid },
      { name, seats },
      { new: true, runValidators: true }
    );
    if (room) {
      res.status(200).send(room);
    } else {
      res.status(404).send({ message: 'Room not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndDelete({ uid: req.params.uid });
    if (room) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createRoom, getRoomsByCinema, getRoom, updateRoom, deleteRoom };
