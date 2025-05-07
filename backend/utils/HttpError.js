class HttpError extends Error {
  constructor(statusCode, message, name = null) {
    super(message);
    this.statusCode = statusCode;
    this.name = name || this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = HttpError;
