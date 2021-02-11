const express = require('express');
const pool = require('../config/db');
const { redisClient } = require('../config/redis');
const {
  registerUser,
  loginUser,
  updateProfile,
  getUsers,
} = require('../db/queries/user');
const { checkDuplicateUser } = require('../middlewares/verifySignup');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.get('/', getUsers(pool));

router.post('/register', checkDuplicateUser, registerUser(pool));

router.post('/login', loginUser(pool));

router.post('/account/update', verifyToken, updateProfile(pool));

router.post('/logout', verifyToken, (request, response) => {
  const { userId, token } = request;

  redisClient.get(userId, (error, data) => {
    if (error) {
      response.send({ error });
    }

    if (data !== null) {
      const parsedData = JSON.parse(data);
      parsedData[userId].push(token);
      redisClient.setex(userId, 3600, JSON.stringify(parsedData));
      return;
    }

    const blacklistData = {
      [userId]: [token],
    };

    redisClient.setex(userId, 3600, JSON.stringify(blacklistData));
  });
});

module.exports = router;
