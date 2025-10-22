export class ErrorResponse extends Error {
  constructor(message, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;

    this.name = this.constructor.name;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
