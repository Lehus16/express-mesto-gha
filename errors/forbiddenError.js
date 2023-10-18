const statusCodes = require('../utils/codeStatus');

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = statusCodes.FORBIDDEN;
  }
}

module.exports = ForbiddenError;
