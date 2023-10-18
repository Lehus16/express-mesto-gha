const statusCodes = require('../utils/codeStatus');

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.BAD_REQUEST;
  }
}

module.exports = BadRequestError;
