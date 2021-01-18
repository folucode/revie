const express = require('express');
const pool = require('../db/connection');
const { getAllApartments } = require('../db/queries/apartments');

const router = new express.Router();

router.get('/apartments', getAllApartments(pool));

module.exports = router;
