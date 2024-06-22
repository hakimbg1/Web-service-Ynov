const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

<<<<<<< HEAD
  if (token == null) return res.sendStatus(401); 

  jwt.verify(token, 'secret', (err, user) => {
=======
  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, 'secret', (err, user) => { // replace 'secret' with your actual secret key
>>>>>>> 29cade4207745c79ded0b7782b6bc0650f01c96f
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

module.exports = authenticateToken;