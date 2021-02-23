const express = require('express');
const pool = require('../config/db');
const {
  getAllReviewsForApartment,
  addNewReview,
  deleteReview,
} = require('../db/queries/reviews');
const { verifyToken } = require('../middlewares/verifyToken');

const router = new express.Router();

router.get(
  '/apartments/:id([0-9]{1,10})/reviews',
  verifyToken,
  getAllReviewsForApartment(pool),
);

router.post(
  '/reviews/apartments/:id([0-9]{1,10})/new',
  verifyToken,
  addNewReview(pool),
);

router.delete(
  '/reviews/:id([0-9]{1,10})/delete',
  verifyToken,
  deleteReview(pool),
);

module.exports = router;
