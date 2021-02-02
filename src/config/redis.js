const redis = require('redis');

const port = process.env.PORT || 6379;

const redisClient = redis.createClient(port);

module.exports = {
  redisClient,
};
