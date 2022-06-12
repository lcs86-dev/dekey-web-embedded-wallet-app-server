const { createLogger, transports, format } = require("winston");
const requestIp = require("request-ip");
const { combine, timestamp, printf } = format;

const logFormat = printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

const logger = createLogger({
  level: "debug",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    logFormat
  ),
  transports: [
    new transports.File({
      filename: "logs/error.log",
      level: "error",
    }),
    new transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

const customLog = (req, res, next) => {
  try {
    const clientIp = requestIp.getClientIp(req);
    let message = `${req.method} ${req.path} ${JSON.stringify(
      req.user
        ? { ip: clientIp, uid: req.user.uid, ...req.body }
        : { ip: clientIp, ...req.body }
    )}`;
    logger.info(message);
    if (next) {
      next();
    }
  } catch (error) {
    if (next) {
      next();
    }
  }
};

const customErrorLog = (err, req) => {
  const clientIp = requestIp.getClientIp(req);
  let message = `${req.method} ${req.path} ${JSON.stringify(
    req.user
      ? { ip: clientIp, uid: req.user.uid, ...req.body }
      : { ip: clientIp, ...req.body }
  )}`;
  logger.error(
    `${message}, error message - ${err.message}, stack trace - ${err.stack}`
  );
};

module.exports = {
  logger,
  customLog,
  customErrorLog,
};
