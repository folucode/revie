const express = require('express');
const pool = require('../config/db');
const { getAllApartments, addNewApartment } = require('../db/queries/apartments');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.post('/apartments/new', verifyToken, addNewApartment(pool));

router.get('/apartments', verifyToken, getAllApartments(pool));

module.exports = router;
