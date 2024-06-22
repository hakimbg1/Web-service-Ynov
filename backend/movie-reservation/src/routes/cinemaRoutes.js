const express = require('express');
const { createCinema, getCinemas, getCinema, updateCinema, deleteCinema } = require('../controllers/cinemaController');
const router = express.Router();

<<<<<<< HEAD
router.post('/', createCinema);
router.get('/', getCinemas);
router.get('/:uid', getCinema);
router.put('/:uid', updateCinema);
router.delete('/:uid', deleteCinema);
=======
router.post('/', createCinema); //admin only
router.get('/', getCinemas); //user
router.get('/:uid', getCinema); //user
router.put('/:uid', updateCinema); // admin only
router.delete('/:uid', deleteCinema); // admin only
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

module.exports = router;
