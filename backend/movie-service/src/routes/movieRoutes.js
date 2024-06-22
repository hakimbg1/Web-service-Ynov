const express = require('express');
const multer = require('multer');
const path = require('path');
const { addMovie, getMovies, getMovie, updateMovie, deleteMovie } = require('../controllers/movieController');

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

router.get('/', getMovies);
router.get('/:uid', getMovie);
router.post('/', upload.single('picture'), addMovie);
router.put('/:uid', upload.single('picture'), updateMovie);
router.delete('/:uid', deleteMovie);

module.exports = router;
