const express = require('express');
const pool = require('../config/db');
const { getAllApartments } = require('../db/queries/apartments');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.get('/apartments', verifyToken, getAllApartments(pool));

module.exports = router;
