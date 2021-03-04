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
      return response.status(401).send({
        status: 'error',
        message: error.message,
      });
    }

    request.userId = decoded.id;
    request.tokenExp = decoded.exp;
    request.token = token;
    next();
  });
};

module.exports = {
  verifyToken,
};
