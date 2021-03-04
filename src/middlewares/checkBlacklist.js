const { redisClient } = require('../config/redis');

module.exports = (request, response, next) => {
  const { userId, token } = request;

  redisClient.get(userId, (error, data) => {
    if (error) {
      return response.status(400).send({ error });
    }

    if (data !== null) {
      const parsedData = JSON.parse(data);
      if (parsedData[userId].includes(token)) {
        return response.send({
          message: 'You have to login!',
        });
      }

      return next();
    }
  });
};
