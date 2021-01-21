const express = require('express');
const pool = require('../config/db');
const {
  registerUser,
  loginUser,
  updateProfile,
  getUsers,
  logout,
} = require('../db/queries/user');
const { checkDuplicateUser } = require('../middlewares/verifySignup');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.get('/', getUsers(pool));

router.post('/register', checkDuplicateUser, registerUser(pool));

router.post('/login', loginUser(pool));

router.post('/account/update', verifyToken, updateProfile(pool));

router.post('/logout', verifyToken, logout);

module.exports = router;
