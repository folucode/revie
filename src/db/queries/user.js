const registerUser = dbInstance => {
  return (request, response) => {
    const { name, email, password } = request.body;

    dbInstance.query(
      'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *',
      [name, email, password],
      (error, results) => {
        if (error) {
          throw error;
        }

        const { rows } = results;

        response.status(201).send(rows[0]);
      }
    );
  };
};

const loginUser = dbInstance => {
  return (request, response) => {
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
        response.status(200).send({ results });
      }
    );
  };
};

module.exports = {
  registerUser,
  loginUser,
};
