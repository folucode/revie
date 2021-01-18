const bcrypt = require('bcryptjs');

/**
 * @method registerUser
 * @description Method to register a new user
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */

const registerUser = (dbInstance) => (request, response) => {
  const { name, email, password } = request.body;

  const encodedPassword = bcrypt.hashSync(password, 8);

  dbInstance.query(
    'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
    [name, email, encodedPassword],
    (error, results) => {
      if (error) {
        throw error;
      }
      const { rows } = results;
      response.status(201).send(rows[0]);
    },
  );
};

/**
 * @method loginUser
 * @description Method to login a registered user
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */

const loginUser = (dbInstance) => (request, response) => {
  const { email, password } = request.body;

  dbInstance.query(
    'SELECT name, email FROM users WHERE email=$1 AND password=$2',
    [email, password],
    (error, results) => {
      if (error) {
        throw error;
      }

      if (results.rows.length < 1) {
        return response.status(404).send({ Error: 'User not found' });
      }
      return response.status(200).send({ results });
    },
  );
};

/**
 * @method updateProfile
 * @description Method to update user profile
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */

const updateProfile = (dbInstance) => (request, response) => {
  const { name, email, password } = request.body;

  dbInstance.query(
    'UPDATE users SET name=$1, email=$2, password=$3 WHERE email=$2 RETURNING *',
    [name, email, password],
    (error, results) => {
      if (error) {
        throw error;
      }

      response.send(results);
    },
  );
};

/**
 * @method getUsers
 * @description Method to get all user profiles
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */

const getUsers = (dbInstance) => (request, response) => {
  dbInstance.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getUsers,
};
