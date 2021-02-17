const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('../../config/auth');

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
  password: Joi.string().required(),
});

const registerSchema = Joi.object({
  name: Joi.string().required().empty(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required().empty(),
  password: Joi.string().required().empty(),
});

/**
 * @method registerUser
 * @description Method to register a new user
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object| Error object
 */
const registerUser = (dbInstance) => async (request, response) => {
  const { name, email, password } = request.body;

  const encodedPassword = bcrypt.hashSync(password, 8);

  try {
    const errorObject = registerSchema.validate(request.body).error;

    if (errorObject) {
      return response.status(422).json({
        status: 'error',
        message: errorObject.message,
        data: request.body,
      });
    }

    const result = await dbInstance.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, encodedPassword],
    );

    if (result.rows < 1) {
      return response.status(400).send({
        status: 'error',
        message: 'Registration failed',
      });
    }

    const { rows } = result;
    const token = jwt.sign({ id: rows[0].id.toString() }, config.secret);

    return response.status(201).send({
      message: 'User successfully registered',
      data: {
        user: rows[0],
        token,
      },
    });
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
const loginUser = (dbInstance) => async (request, response) => {
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

    const result = await dbInstance.query(
      'SELECT id, name, password FROM users WHERE email=$1',
      [email],
    );

    if (result.rowCount < 1) {
      return response.status(501).send({
        status: 'error',
        message: 'Invalid login credentials',
        data: request.body,
      });
    }

    const validPassword = bcrypt.compareSync(
      password,
      result.rows[0].password,
    );

    if (!validPassword) {
      return response.status(401).send({
        status: 'fail',
        data: { password: 'Invalid Password!' },
      });
    }

    const token = jwt.sign({ id: result.rows[0].id }, config.secret, {
      expiresIn: 86400, // 24 hours
    });

    const { id, name } = result.rows[0];

    return response.status(200).send({
      message: 'Login Successful',
      data: {
        user: {
          id, name, email,
        },
        token,
      },
    });
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

const updateProfile = (dbInstance) => async (request, response) => {
  const { userId, body } = request;

  try {
    const errorObject = registerSchema.validate(request.body).error;

    if (errorObject) {
      return response.status(422).json({
        status: 'error',
        message: errorObject.message,
        data: request.body,
      });
    }

    const { name, email, password } = Object.values(body);

    const encodedPassword = bcrypt.hashSync(password, 8);

    const result = await dbInstance.query(
      'UPDATE users SET name=$2, email=$3, password=$4 WHERE id=$1 RETURNING *',
      [userId, name, email, encodedPassword],
    );

    return response.send({
      message: 'Profile Successfully Updated',
      data: result.rows[0],
    });
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
const getUserProfile = (dbInstance) => async (request, response) => {
  const { userId } = request;

  try {
    const result = await dbInstance.query(
      'SELECT id, name, email FROM users WHERE id=$1',
      [userId],
    );

    return response.send({
      message: 'User Profile',
      data: result.rows[0],
    });
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
