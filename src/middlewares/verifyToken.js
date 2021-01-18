const jwt = require('jsonwebtoken');
const db = require('../config/db');
const config = require('../config/auth');

const verifyToken = (request, response, next) => {
  const token = request.headers['x-access-token'];

  if (!token) {
    return response.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      return response.status(401).send({
        message: 'Unauthorized!',
      });
    }

    request.userId = decoded.id;
    next();
  });
};

module.exports = {
  verifyToken,
};
