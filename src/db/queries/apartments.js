const getAllApartments = (dbInstance) => (request, response) => {
  dbInstance.query(
    'SELECT * FROM apartments ORDER BY id ASC',
    (error, results) => {
      if (error) {
        throw error;
      }
      return response.status(200).json(results.rows);
    },
  );
};

module.exports = {
  getAllApartments,
};
