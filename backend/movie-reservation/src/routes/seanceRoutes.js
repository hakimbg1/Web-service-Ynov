const express = require('express');
const { createSeance, getSeances, getSeance, updateSeance, deleteSeance } = require('../controllers/seanceController');

const router = express.Router();

router.get('/', getSeances);
router.get('/:uid', getSeance); 
router.post('/', createSeance); 
router.put('/:uid', updateSeance); 
router.delete('/:uid', deleteSeance);


module.exports = router;
