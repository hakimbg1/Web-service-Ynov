const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401); // if there isn't any token

  jwt.verify(token, 'secret', (err, user) => { // replace 'secret' with your actual secret key
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
  });
};

module.exports = authenticateToken;