const express = require('express');
const { createRoom, getRoomsByCinema, getRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const router = express.Router();

router.post('/', createRoom);
router.get('/cinema/:cinemaUid/rooms', getRoomsByCinema);
router.get('/rooms/:uid', getRoom); 
router.put('/rooms/:uid', updateRoom);
router.delete('/rooms/:uid', deleteRoom);

module.exports = router;