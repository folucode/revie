const express = require('express');
const pool = require('../config/db');
const {
  registerUser,
  loginUser,
  updateProfile,
  getUsers,
} = require('../db/queries/user');

const router = new express.Router();

router.get('/', getUsers(pool));

router.post('/register', registerUser(pool));

router.post('/login', loginUser(pool));

router.post('/account/update', updateProfile(pool));

module.exports = router;
