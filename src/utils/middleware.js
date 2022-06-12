const { validationResult } = require("express-validator");
const { CustomError } = require("./error");

const bodyValidationMiddleware = (req, res, next) => {
  console.log("req.body", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new CustomError(
      400,
      "INVALID_PAYLOAD",
      JSON.stringify(errors.array())
    );
  }
  next();
};

module.exports = {
  bodyValidationMiddleware,
};
