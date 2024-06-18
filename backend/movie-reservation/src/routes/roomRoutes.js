const express = require('express');
const { createRoom, getRoomsByCinema, getRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const router = express.Router();

router.post('/', createRoom); //admin only
router.get('/cinema/:cinemaUid/rooms', getRoomsByCinema); // user
router.get('/rooms/:uid', getRoom); // user
router.put('/rooms/:uid', updateRoom); // admin only
router.delete('/rooms/:uid', deleteRoom); // admin only

module.exports = router;