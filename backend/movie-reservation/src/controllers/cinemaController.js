const Cinema = require('../models/cinemaModel');
const { v4: uuidv4 } = require('uuid');

const createCinema = async (req, res) => {
  try {
    const { name } = req.body;
    const cinema = new Cinema({ uid: uuidv4(), name });
    await cinema.save();
    res.status(201).send(cinema);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const getCinemas = async (req, res) => {
  try {
    const cinemas = await Cinema.find();
    if (cinemas.length > 0) {
      res.status(200).send(cinemas);
    } else {
      res.status(204).send();
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const getCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findOne({ uid: req.params.uid });
    if (cinema) {
      res.status(200).send(cinema);
    } else {
      res.status(404).send({ message: 'Cinema not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateCinema = async (req, res) => {
  try {
    const { name } = req.body;
    const cinema = await Cinema.findOneAndUpdate(
      { uid: req.params.uid },
      { name },
      { new: true, runValidators: true }
    );
    if (cinema) {
      res.status(200).send(cinema);
    } else {
      res.status(404).send({ message: 'Cinema not found' });
    }
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(422).send(error);
    } else {
      res.status(500).send(error);
    }
  }
};

const deleteCinema = async (req, res) => {
  try {
    const cinema = await Cinema.findOneAndDelete({ uid: req.params.uid });
    if (cinema) {
      res.status(204).send();
    } else {
      res.status(404).send({ message: 'Cinema not found' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createCinema, getCinemas, getCinema, updateCinema, deleteCinema };
