const { response } = require('express');
const db = require('../config/db');

const checkAuth = (db) => (request, response, next) => {
  const { userId } = request;

  
};
