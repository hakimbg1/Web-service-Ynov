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
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
  }
});

const upload = multer({ storage: storage });

router.get('/', getMovies); // public
router.get('/:uid', getMovie); // public
router.post('/', upload.single('picture'), addMovie); // admin role only
router.put('/:uid', upload.single('picture'), updateMovie); // admin role only
router.delete('/:uid', deleteMovie); // admin role only

module.exports = router;
