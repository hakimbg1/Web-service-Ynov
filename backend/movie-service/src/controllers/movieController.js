const Movie = require('../models/movieModel');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

exports.addMovie = async (req, res) => {
  try {
    const { name, description, rate, duration, hasReservationsAvailable } = req.body;
    const uid = uuidv4();
    const pictureUrl = req.body.pictureUrl || '';

    const newMovie = new Movie({
      uid,
      name,
      description,
      rate,
      duration,
      hasReservationsAvailable: hasReservationsAvailable || false,
      pictureUrl
    });

    const savedMovie = await newMovie.save();
    res.status(201).json(savedMovie);
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie', error });
  }
};

exports.getMovies = async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error });
  }
};

exports.getMovie = async (req, res) => {
  try {
    const { uid } = req.params;
    const movie = await Movie.findOne({ uid });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movie', error });
  }
};

exports.updateMovie = async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, description, rate, duration, hasReservationsAvailable } = req.body;
    const pictureUrl = req.file ? `/uploads/${req.file.filename}` : req.body.pictureUrl;

    const movie = await Movie.findOneAndUpdate(
      { uid },
      { name, description, rate, duration, hasReservationsAvailable, pictureUrl },
      { new: true }
    );
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error });
  }
};

exports.deleteMovie = async (req, res) => {
  try {
    const { uid } = req.params;
    const movie = await Movie.findOneAndDelete({ uid });
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.status(200).json({ message: 'Movie deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error });
  }
};