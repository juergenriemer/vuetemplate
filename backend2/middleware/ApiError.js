class ApiError {
  constructor(code, message, stack = "n/a") {
    this.code = code;
    this.message = message;
    this.stack = stack;
  }

  // REF: remove statics? or not?
  static badRequest(msg) {
    return new ApiError(400, msg);
  }

  static internal(msg) {
    return new ApiError(500, msg);
  }
}

module.exports = ApiError;
