const express = require('express');
const pool = require('../db/connection');
const { getUsers } = require('../db/queries');
const { registerUser, loginUser } = require('../db/queries/user');
const router = new express.Router();

router.get('/', getUsers(pool));

router.post('/register', registerUser(pool));

router.post('/login', loginUser(pool));

module.exports = router;
