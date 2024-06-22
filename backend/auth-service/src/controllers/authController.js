const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const register = async (req, res) => {
  try {
<<<<<<< HEAD
    const { username, password, role = 'Client' } = req.body;
=======
    const { username, password, role = 'user' } = req.body;
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, role });
    await user.save();
    res.status(201).send({ message: 'User registered' });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && await bcrypt.compare(password, user.password)) {
<<<<<<< HEAD
      const token = jwt.sign({ id: user._id, role: user.role, username: user.username }, 'secret', { expiresIn: '1h' });
=======
      const token = jwt.sign({ id: user._id, role: user.role }, 'secret', { expiresIn: '1h' });
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
      res.status(200).send({ token });
    } else {
      res.status(401).send({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};

const renewToken = (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
<<<<<<< HEAD
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role, username: decoded.username }, 'secret', { expiresIn: '1h' });
=======
    const newToken = jwt.sign({ id: decoded.id, role: decoded.role }, 'secret', { expiresIn: '1h' });
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
    res.status(200).send({ token: newToken });
  } catch (error) {
    res.status(401).send({ message: 'Invalid token' });
  }
};

const verifyToken = (req, res) => {
  // First check the Authorization header
  let token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

  // If the Authorization header is not present, check the custom token header
  if (!token) {
    token = req.headers['token'];
  }

  if (!token) {
    return res.status(403).send({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'secret');
<<<<<<< HEAD
    const username = decoded.username || null;
    res.status(200).send({ ...decoded, username });
=======
    res.status(200).send(decoded);
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
  } catch (error) {
    res.status(403).send({ message: 'Invalid token' });
  }
};

module.exports = { register, login, renewToken, verifyToken };