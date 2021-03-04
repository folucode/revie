const express = require('express');
const pool = require('../config/db');
const { redisClient } = require('../config/redis');
const {
  registerUser,
  loginUser,
  updateProfile,
  getUsers,
  getUserProfile,
} = require('../db/queries/user');
const { checkDuplicateUser } = require('../middlewares/checkDuplicateUser');
const { verifyToken } = require('../middlewares/verifyToken');
const checkBlacklist = require('../middlewares/checkBlacklist');

const router = new express.Router();

router.get('/', getUsers(pool));

router.post('/register', checkDuplicateUser, registerUser(pool));

router.post('/login', loginUser(pool));

router.post('/logout', verifyToken, (request, response) => {
  const { userId, token, tokenExp } = request;

  redisClient.get(userId, (error, data) => {
    if (error) {
      return response.send({ error });
    }

    if (data !== null) {
      const parsedData = JSON.parse(data);
      parsedData[userId].push(token);
      redisClient.setex(userId, tokenExp, JSON.stringify(parsedData));
      return response.send({
        status: 'success',
        message: 'Logout successful',
      });
    }

    const blacklistData = {
      [userId]: [token],
    };

    redisClient.setex(userId, tokenExp, JSON.stringify(blacklistData));
    return response.send({
      status: 'success',
      message: 'Logout successful',
    });
  });
});

router.post('/account/update', verifyToken, checkBlacklist, updateProfile(pool));

router.get('/me', verifyToken, checkBlacklist, getUserProfile(pool));

module.exports = router;
