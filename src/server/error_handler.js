const { CustomError } = require("../utils/error");
const { customErrorLog } = require("../utils/logger");

module.exports = (err, req, res, next) => {
  customErrorLog(err, req);

  console.log("error_handler err", err);

  if (err instanceof CustomError) {
    return res.status(err.code).json(err);
  }
  return res.status(500).json(err);
};
