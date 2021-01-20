const jwt = require('jsonwebtoken');
const config = require('../config/auth');

/**
 * @param {*} request
 * @param {*} response
 * @param {*} next
 */
const verifyToken = (request, response, next) => {
  const token = request.header('Authorization').replace('Bearer ', '');

  if (!token) {
    response.status(403).send({
      message: 'No token provided!',
    });
  }

  jwt.verify(token, config.secret, (error, decoded) => {
    if (error) {
      response.status(401).send({
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
