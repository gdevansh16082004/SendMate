/**
 * Standardized API response handler
 */

const successResponse = (res, statusCode = 200, message, data = null) => {
  const response = {
    success: true,
    message,
    ...(data && { data })
  };
  return res.status(statusCode).json(response);
};

const errorResponse = (res, statusCode = 500, message, errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors && { errors })
  };
  return res.status(statusCode).json(response);
};

module.exports = {
  successResponse,
  errorResponse
};
