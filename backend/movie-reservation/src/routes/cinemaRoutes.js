const express = require('express');
const { createCinema, getCinemas, getCinema, updateCinema, deleteCinema } = require('../controllers/cinemaController');
const router = express.Router();

router.post('/', createCinema);
router.get('/', getCinemas);
router.get('/:uid', getCinema);
router.put('/:uid', updateCinema);
router.delete('/:uid', deleteCinema);

module.exports = router;
