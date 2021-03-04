const { redisClient } = require('../config/redis');

module.exports = (request, response, next) => {
  const { token } = request;

  redisClient.get(`blacklist_${token}`, (error, data) => {
    if (error) {
      return response.status(400).send({ error });
    }

    if (data !== null) {
      return response.send({
        message: 'You have to login!',
      });
    }

    return next();
  });
};
