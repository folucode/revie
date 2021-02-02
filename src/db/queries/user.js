const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

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
      const token = jwt.sign({ id: rows[0].id.toString() }, config.secret);

      response.status(201).send({
        message: 'User successfully registered',
        user: rows[0],
        token,
      });
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
    'SELECT id, name, password FROM users WHERE email=$1',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }

      const validPassword = bcrypt.compareSync(
        password,
        results.rows[0].password,
      );

      if (!validPassword) {
        return response.status(401).send({
          token: null,
          message: 'Invalid Password!',
        });
      }

      const token = jwt.sign({ id: results.rows[0].id }, config.secret, {
        expiresIn: 86400, // 24 hours
      });

      return response.status(200).send({
        id: results.rows[0].id,
        username: results.rows[0].name,
        email,
        token,
      });
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
  const { userId, body } = request;

  dbInstance.query(
    'UPDATE users SET name=$2, email=$3, password=$4 WHERE id=$1 RETURNING *',
    [userId, ...Object.values(body)],
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
