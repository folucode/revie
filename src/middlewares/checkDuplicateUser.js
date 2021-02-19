const db = require('../config/db');

/**
 * @method checkDuplicateUser
 * @description Method to check for a duplicate user
 * @param  {} request
 * @param  {} response
 * @param  {} next
 * @returns {object} - Error response | next();
 */
const checkDuplicateUser = async (request, response, next) => {
  const { email } = request.body;

  try {
    const result = await db.query('SELECT COUNT(*) FROM users WHERE email=$1', [
      email,
    ]);

    const rowsFound = parseInt(result.rows[0].count, 10);

    if (rowsFound > 0) {
      return response.status(403).send({
        status: 'error',
        message: 'User with this email address already exists',
      });
    }

    return next();
  } catch (error) {
    const { message, stack, code } = error;

    return response.status(500).send({
      status: 'error',
      message,
      code,
      data: stack,
    });
  }
};

module.exports = {
  checkDuplicateUser,
};
