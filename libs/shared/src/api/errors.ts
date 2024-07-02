export class ServerError extends Error {
  constructor(message: string = "Internal Server Error") {
    super(message);
    this.name = "ServerError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string = "Not Found") {
    super(message);
    this.name = "NotFoundError";
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = "Authentication Error") {
    super(message);
    this.name = "AuthenticationError";
  }
}

export class PermissionDeniedError extends Error {
  constructor(message: string = "Permission Denied Error") {
    super(message);
    this.name = "PermissionDeniedError";
  }
}

export class BadRequestError extends Error {
  constructor(message: string = "Bad Request") {
    super(message);
    this.name = "BadRequestError";
  }
}

export class ErrorFactory {
  static from(error: { errorCode?: number; error?: string }): never {
    if (!error.errorCode) throw new ServerError(error.error);

    switch (error.errorCode) {
      case 401:
        throw new AuthenticationError(error.error);
      case 403:
        throw new PermissionDeniedError(error.error);
      case 404:
        throw new NotFoundError(error.error);
      case 400:
        throw new BadRequestError(error.error);
      default:
        throw new ServerError(error.error);
    }
  }
}
