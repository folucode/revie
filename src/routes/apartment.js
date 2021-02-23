const express = require('express');
const pool = require('../config/db');
const {
  getAllApartments,
  addNewApartment,
  getApartment,
  updateApartment,
  deleteApartment,
  getMyApartments,
  getApartmentsByLocation,
  getApartmentsByUser,
} = require('../db/queries/apartment');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.post('/apartments/new', verifyToken, addNewApartment(pool));

router.get('/apartments', verifyToken, getAllApartments(pool));

router.get('/apartments/:id([0-9]{1,10})', verifyToken, getApartment(pool));

router.get('/apartments/location/:location', verifyToken, getApartmentsByLocation(pool));

router.get('/apartments/me', verifyToken, getMyApartments(pool));

router.get('/apartments/user/:id([0-9]{1,10})', verifyToken, getApartmentsByUser(pool));

router.patch('/apartments/:id/update', verifyToken, updateApartment(pool));

router.delete('/apartments/:id/delete', verifyToken, deleteApartment(pool));

module.exports = router;
