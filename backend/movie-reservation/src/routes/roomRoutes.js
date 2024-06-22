const express = require('express');
const { createRoom, getRoomsByCinema, getRoom, updateRoom, deleteRoom } = require('../controllers/roomController');
const router = express.Router();

<<<<<<< HEAD
router.post('/', createRoom);
router.get('/cinema/:cinemaUid/rooms', getRoomsByCinema);
router.get('/rooms/:uid', getRoom); 
router.put('/rooms/:uid', updateRoom);
router.delete('/rooms/:uid', deleteRoom);
=======
router.post('/', createRoom); //admin only
router.get('/cinema/:cinemaUid/rooms', getRoomsByCinema); // user
router.get('/rooms/:uid', getRoom); // user
router.put('/rooms/:uid', updateRoom); // admin only
router.delete('/rooms/:uid', deleteRoom); // admin only
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f

module.exports = router;