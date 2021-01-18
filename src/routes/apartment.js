const express = require('express');
const pool = require('../config/db');
const { getAllApartments } = require('../db/queries/apartments');

const router = new express.Router();

router.get('/apartments', getAllApartments(pool));

module.exports = router;
