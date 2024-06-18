const express = require('express');
const { createCinema, getCinemas, getCinema, updateCinema, deleteCinema } = require('../controllers/cinemaController');
const router = express.Router();

router.post('/', createCinema); //admin only
router.get('/', getCinemas); //user
router.get('/:uid', getCinema); //user
router.put('/:uid', updateCinema); // admin only
router.delete('/:uid', deleteCinema); // admin only

module.exports = router;
