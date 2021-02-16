const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string(),
});

/**
 * @method registerUser
 * @description Method to register a new user
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object| Error object
 */
const registerUser = (dbInstance) => (request, response) => {
  const { name, email, password } = request.body;

  const encodedPassword = bcrypt.hashSync(password, 8);

  try {
    dbInstance.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, encodedPassword],
      (error, results) => {
        if (error) {
          const { message, stack, code } = error;

          return response.status(501).send({
            status: 'error',
            message,
            code,
            data: stack,
          });
        }
        const { rows } = results;
        const token = jwt.sign({ id: rows[0].id.toString() }, config.secret);

        return response.status(201).send({
          message: 'User successfully registered',
          data: {
            user: rows[0],
            token,
          },
        });
      },
    );
  } catch (error) {
    const { message, stack, code } = error;

    return response.status(400).send({
      status: 'error',
      message,
      code,
      data: stack,
    });
  }
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

  try {
    const errorObject = loginSchema.validate(request.body).error;

    if (errorObject) {
      return response.status(422).json({
        status: 'error',
        message: errorObject.message,
        data: request.body,
      });
    }

    dbInstance.query(
      'SELECT id, name, password FROM users WHERE email=$1',
      [email],
      (error, results) => {
        if (error) {
          const { message, stack, code } = error;

          return response.status(501).send({
            status: 'error',
            message,
            code,
            data: stack,
          });
        }

        if (results.rowCount < 1) {
          return response.status(501).send({
            status: 'error',
            message: 'Invalid user credentials',
            data: request.body,
          });
        }

        const validPassword = bcrypt.compareSync(
          password,
          results.rows[0].password,
        );

        if (!validPassword) {
          return response.status(401).send({
            status: 'fail',
            data: { password: 'Invalid Password!' },
          });
        }

        const token = jwt.sign({ id: results.rows[0].id }, config.secret, {
          expiresIn: 86400, // 24 hours
        });

        const { id, name } = results.rows[0];

        return response.status(200).send({
          message: 'Login Successful',
          data: {
            user: {
              id, name, email,
            },
            token,
          },
        });
      },
    );
  } catch (error) {
    const { message, stack, code } = error;

    return response.status(400).send({
      status: 'error',
      message,
      code,
      data: stack,
    });
  }
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

  try {
    dbInstance.query(
      'UPDATE users SET name=$2, email=$3, password=$4 WHERE id=$1 RETURNING *',
      [userId, ...Object.values(body)],
      (error, results) => {
        if (error) {
          const { message, stack, code } = error;

          return response.status(400).send({
            status: 'error',
            message,
            code,
            data: stack,
          });
        }

        return response.send({
          message: 'Profile Successfully Updated',
          data: results.rows[0],
        });
      },
    );
  } catch (error) {
    const { message, stack, code } = error;

    return response.status(400).send({
      status: 'error',
      message,
      code,
      data: stack,
    });
  }
};

/**
 * @method getUserProfile
 * @description Method to get user profile
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const getUserProfile = (dbInstance) => (request, response) => {
  const { userId } = request;

  try {
    dbInstance.query(
      'SELECT * FROM users WHERE id=$1',
      [userId],
      (error, results) => {
        if (error) {
          const { message, stack, code } = error;

          return response.status(400).send({
            status: 'error',
            message,
            code,
            data: stack,
          });
        }
        return response.send({
          message: 'User Profile',
          data: results.rows[0],
        });
      },
    );
  } catch (error) {
    const { message, stack, code } = error;

    return response.status(400).send({
      status: 'error',
      message,
      code,
      data: stack,
    });
  }
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
  getUserProfile,
};
