const { validationResult } = require("express-validator");

class CustomError extends Error {
  constructor(code, name, message, ...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }

    this.code = code;
    this.message = message;
    this.name = name;
  }
}

const validationErrorHandler = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
};

module.exports = {
  validationErrorHandler,
  CustomError,
};
