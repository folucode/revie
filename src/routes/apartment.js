const express = require('express');
const pool = require('../config/db');
const { getAllApartments, addNewApartment, getApartment } = require('../db/queries/apartment');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.post('/apartments/new', verifyToken, addNewApartment(pool));

router.get('/apartments', verifyToken, getAllApartments(pool));

router.get('/apartments/:id', verifyToken, getApartment(pool));

module.exports = router;
