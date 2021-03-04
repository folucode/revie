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
const checkBlacklist = require('../middlewares/checkBlacklist');

const router = new express.Router();

router.post('/apartments/new', verifyToken, checkBlacklist, addNewApartment(pool));

router.get('/apartments', verifyToken, checkBlacklist, getAllApartments(pool));

router.get('/apartments/:id([0-9]{1,10})', verifyToken, checkBlacklist, getApartment(pool));

router.get('/apartments/location/:location', verifyToken, checkBlacklist, getApartmentsByLocation(pool));

router.get('/apartments/me', verifyToken, checkBlacklist, getMyApartments(pool));

router.get('/apartments/user/:id([0-9]{1,10})', verifyToken, checkBlacklist, getApartmentsByUser(pool));

router.patch('/apartments/:id/update', verifyToken, checkBlacklist, updateApartment(pool));

router.delete('/apartments/:id/delete', verifyToken, checkBlacklist, deleteApartment(pool));

module.exports = router;
