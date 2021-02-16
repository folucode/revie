/**
 * @method getAllApartments
 * @description Method get all apartments
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const getAllApartments = (dbInstance) => (request, response) => {
  try {
    dbInstance.query(
      'SELECT apartments.id, type, address, state, name AS owner FROM apartments INNER JOIN users ON users.id = apartments.owner_id ORDER BY id ASC',
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

        return response.status(200).json({
          message: 'Success',
          data: results.rows,
        });
      },
    );
  } catch (error) {
    if (error) {
      const { message, stack, code } = error;

      return response.status(400).send({
        status: 'error',
        message,
        code,
        data: stack,
      });
    }
  }
};

module.exports = {
  getAllApartments,
};
