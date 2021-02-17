const express = require('express');
const pool = require('../config/db');
const {
  getAllApartments, addNewApartment, getApartment, updateApartment, deleteApartment,
} = require('../db/queries/apartment');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.post('/apartments/new', verifyToken, addNewApartment(pool));

router.get('/apartments', verifyToken, getAllApartments(pool));

router.get('/apartments/:id', verifyToken, getApartment(pool));

router.patch('/apartments/:id/update', verifyToken, updateApartment(pool));

router.delete('/apartments/:id/delete', verifyToken, deleteApartment(pool));

module.exports = router;
