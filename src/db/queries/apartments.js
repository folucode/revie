const getUsers = (dbInstance) => (request, response) => {
  dbInstance.query(
    'SELECT * FROM users ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

const getAllApartments = (dbInstance) => (request, response) => {
  dbInstance.query(
    'SELECT * FROM apartments ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    },
  );
};

module.exports = {
  getUsers,
  getAllApartments,
};
