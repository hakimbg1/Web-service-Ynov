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
<<<<<<< HEAD
    cb(null, Date.now() + path.extname(file.originalname));
=======
    cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
  }
});

const upload = multer({ storage: storage });

<<<<<<< HEAD
router.get('/', getMovies);
router.get('/:uid', getMovie);
router.post('/', upload.single('picture'), addMovie);
router.put('/:uid', upload.single('picture'), updateMovie);
router.delete('/:uid', deleteMovie);
=======
router.get('/', getMovies); // public
router.get('/:uid', getMovie); // public
router.post('/', upload.single('picture'), addMovie); // admin role only
router.put('/:uid', upload.single('picture'), updateMovie); // admin role only
router.delete('/:uid', deleteMovie); // admin role only
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

module.exports = router;
