/**
 * @method getAllReviewsForApartment
 * @description Method to get all the reviews for a particular apartment
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const getAllReviewsForApartment = (dbInstance) => async (request, response) => {
  try {
    const result = await dbInstance.query(
      'SELECT reviews.id, user_id, apartment_id, body, type, address, state, name AS user_name FROM reviews INNER JOIN apartments ON reviews.apartment_id = apartments.id INNER JOIN users ON users.id = reviews.user_id WHERE apartment_id = $1',
      [request.params.id],
    );

    if (result.rows < 1) {
      return response.status(204).send({
        status: 'error',
        message: 'There are no reviews for this apartment yet.',
      });
    }

    const responseObject = [];

    result.rows.forEach((data) => {
      responseObject.push({
        user: {
          id: data.user_id,
          name: data.user_name,
        },
        apartment: {
          id: data.apartment_id,
          type: data.type,
          address: data.address,
          state: data.state,
        },
        review: {
          id: data.id,
          body: data.body,
        },
      });
    });

    return response.send({
      message: 'Success',
      data: responseObject,
    });
  } catch (error) {
    if (error) {
      const { message, stack, code } = error;

      return response.status(500).send({
        status: 'error',
        message,
        code,
        data: stack,
      });
    }
  }
};

/**
 * @method addNewReview
 * @description Method to add a new review
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const addNewReview = (dbInstance) => async (request, response) => {
  const { body, params, userId } = request;

  try {
    const result = await dbInstance.query(
      'INSERT INTO reviews (user_id, apartment_id, body) VALUES($1, $2, $3) RETURNING *',
      [userId, params.id, body.body],
    );

    if (result.rows < 1) {
      return response.status(500).send({
        status: 'error',
        message: "Couldn't add review",
      });
    }

    return response.status(201).send({
      message: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    if (error) {
      const { message, stack, code } = error;

      return response.status(500).send({
        status: 'error',
        message,
        code,
        data: stack,
      });
    }
  }
};

/**
 * @method deleteReview
 * @description Method to delete a review
 * @param {object} dbInstance - The database instance
 * @param {object} request - The request object
 * @param {object} response - The response object
 * @returns {object} - Response object
 */
const deleteReview = (dbInstance) => async (request, response) => {
  const { params } = request;

  try {
    const result = await dbInstance.query(
      'DELETE FROM reviews WHERE id = $1 RETURNING *',
      [params.id],
    );

    if (result.rows < 1) {
      return response.status(500).send({
        status: 'error',
        message: "Couldn't find review",
      });
    }

    return response.status(201).send({
      message: 'review deleted',
      data: result.rows[0],
    });
  } catch (error) {
    if (error) {
      const { message, stack, code } = error;

      return response.status(500).send({
        status: 'error',
        message,
        code,
        data: stack,
      });
    }
  }
};

module.exports = {
  getAllReviewsForApartment,
  addNewReview,
  deleteReview,
};
