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

module.exports = {
  getAllReviewsForApartment,
};
