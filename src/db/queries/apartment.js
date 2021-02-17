const Joi = require('joi');

const addApartmentSchema = Joi.object({
  type: Joi.string().required().empty(),
  address: Joi.string().required().empty(),
  state: Joi.string().required().empty(),
});

/**
 * @method getAllApartments
 * @description Method to get all apartments
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const getAllApartments = (dbInstance) => async (request, response) => {
  try {
    const result = await dbInstance.query(
      'SELECT apartments.id, owner_id, type, address, state, name AS owner FROM apartments INNER JOIN users ON users.id = apartments.owner_id ORDER BY id ASC',
    );

    if (result.rows < 1) {
      return response.status(402).json({
        status: 'error',
        message: 'There are no apartments yet.',
      });
    }

    return response.status(200).json({
      message: 'Success',
      data: result.rows,
    });
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

/**
 * @method getApartment
 * @description Method to get a specific apartment
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const getApartment = (dbInstance) => async (request, response) => {
  const { params } = request;

  try {
    const result = await dbInstance.query('SELECT apartments.id, owner_id, type, address, state, name AS owner FROM apartments INNER JOIN users ON users.id = apartments.owner_id WHERE apartments.id=$1', [params.id]);

    if (result.rows < 1) {
      return response.status(404).send({
        status: 'error',
        message: 'Apartment not found',
      });
    }

    return response.send({
      message: 'Success',
      data: result.rows[0],
    });
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

/**
 * @method addNewApartment
 * @description Method to add a new apartment
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const addNewApartment = (dbInstance) => async (request, response) => {
  const {
    type, address, state,
  } = request.body;

  try {
    const errorObject = addApartmentSchema.validate(request.body).error;

    if (errorObject) {
      return response.status(422).json({
        status: 'error',
        message: errorObject.message,
        data: request.body,
      });
    }

    const result = await dbInstance.query('INSERT INTO apartments (owner_id, type, address, state) VALUES ($1, $2, $3, $4) RETURNING * ', [request.userId, type, address, state]);

    if (result.rows < 1) {
      return response.status(400).send({
        status: 'error',
        message: "Couldn't add apartment",
      });
    }

    return response.send({
      message: 'success',
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

const getMyApartments = (dbInstance) => async (request, response) => {
  const { userId } = request;
  try {
    const result = await dbInstance.query('SELECT * FROM apartments WHERE owner_id=$1', [userId]);

    if (result.rows < 1) {
      return response.status(400).send({
        status: 'error',
        message: 'You have no apartments',
      });
    }

    return response.send({
      status: 'Success',
      message: 'Apartments fetched successfully',
      data: result.rows,
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
 * @method updateApartment
 * @description Method to update the parameters of a particular apartment
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const updateApartment = (dbInstance) => async (request, response) => {
  const {
    type, address, state,
  } = request.body;

  try {
    const errorObject = addApartmentSchema.validate(request.body).error;

    if (errorObject) {
      return response.status(422).json({
        status: 'error',
        message: errorObject.message,
        data: request.body,
      });
    }

    const result = await dbInstance.query('UPDATE apartments SET type=$2, address=$3, state=$4 WHERE id=$1 AND owner_id=$5 RETURNING *', [request.params.id, type, address, state, request.userId]);

    if (result.rows < 1) {
      return response.status(400).send({
        status: 'error',
        message: "Couldn't perform update",
      });
    }

    return response.send({
      status: 'success',
      message: 'Successfully updated apartment',
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
 * @method deleteApartment
 * @description Method to delete a particular apartment
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const deleteApartment = (dbInstance) => async (request, response) => {
  const { params, userId } = request;

  try {
    const result = await dbInstance.query('DELETE FROM apartments WHERE id=$1 AND owner_id=$2 RETURNING *', [params.id, userId]);

    if (result.rows < 1) {
      return response.status(400).send({
        status: 'error',
        message: "Couldn't perform delete operation",
      });
    }

    return response.send({
      status: 'success',
      message: 'Successfully deleted apartment',
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

module.exports = {
  getAllApartments,
  addNewApartment,
  getApartment,
  updateApartment,
  deleteApartment,
  getMyApartments,
};
