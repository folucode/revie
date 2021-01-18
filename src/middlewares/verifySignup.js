const db = require('../config/db');

/**
 * @method checkDuplicateUser
 * @description Method to check for a duplicate user
 * @param  {} request
 * @param  {} response
 * @param  {} next
 * @returns {object} - Error response | next();
 */
const checkDuplicateUser = (request, response, next) => {
  const { email } = request.body;
  db.query(
    'SELECT COUNT(*) FROM users WHERE email=$1',
    [email],
    (error, results) => {
      if (error) {
        throw error;
      }

      const rowsFound = parseInt(results.rows[0].count);

      if (rowsFound > 0) {
        return response.json({
          Error: 'User with Email address already exists',
        });
      }

      next();
    },
  );
};

module.exports = {
  checkDuplicateUser,
};
