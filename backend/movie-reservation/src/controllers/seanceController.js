const Seance = require('../models/seanceModel');
const { v4: uuidv4 } = require('uuid');

const createSeance = async (req, res) => {
  try {
    const { movie, roomUids, date, username } = req.body;
    const seance = new Seance({ uid: uuidv4(), movie, roomUids, date, username });
    await seance.save();
    res.status(201).send(seance);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const getSeances = async (req, res) => {
  try {
    const seances = await Seance.find({});
    res.status(200).send(seances);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getSeance = async (req, res) => {
  try {
    const seance = await Seance.findOne({ uid: req.params.uid });
    if (seance) {
      res.status(200).send(seance);
    } else {
      res.status(404).send({ message: 'Seance not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateSeance = async (req, res) => {
  try {
    const { movie, roomUids, date } = req.body;
    const seance = await Seance.findOneAndUpdate(
      { uid: req.params.uid },
      { movie, roomUids, date },
      { new: true, runValidators: true }
    );
    if (seance) {
      res.status(200).send(seance);
    } else {
      res.status(404).send({ message: 'Seance not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const deleteSeance = async (req, res) => {
  try {
    const seance = await Seance.findOneAndDelete({ uid: req.params.uid });
    if (seance) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Seance not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};


module.exports = { createSeance, getSeances, getSeance, updateSeance, deleteSeance };