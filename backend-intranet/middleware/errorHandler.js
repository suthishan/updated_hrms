const logger = require('../utils/logger');
const { apiResponse } = require('../utils/helpers');

/**
 * Global error handler
 */
const errorHandler = (err, req, res, _next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method}`);

    if (err.code === '23505') {
        return apiResponse(res, 409, false, 'Duplicate entry. This record already exists.');
    }

    if (err.code === '23503') {
        return apiResponse(res, 400, false, 'Referenced record not found.');
    }

    const statusCode = err.status || 500;
    const message =
        process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message || 'Something went wrong';

    return apiResponse(res, statusCode, false, message);
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res) => {
    return apiResponse(res, 404, false, `Route ${req.originalUrl} not found`);
};

module.exports = { errorHandler, notFoundHandler };
