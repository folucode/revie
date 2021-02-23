const express = require('express');
const pool = require('../config/db');
const { getAllReviewsForApartment } = require('../db/queries/reviews');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.get(
  '/apartments/:id([0-9]{1,10})/reviews',
  verifyToken,
  getAllReviewsForApartment(pool),
);

module.exports = router;
