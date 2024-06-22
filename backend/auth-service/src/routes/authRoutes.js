const express = require('express');
const { register, login, renewToken, verifyToken } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/renew-token', renewToken);
router.post('/verify', verifyToken);

module.exports = router;
