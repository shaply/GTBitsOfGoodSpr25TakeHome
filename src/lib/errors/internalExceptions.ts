import { HTTP_STATUS_CODE } from "../types/apiResponse";

export abstract class InternalException extends Error {
  code: HTTP_STATUS_CODE;
  constructor(message: string, code: HTTP_STATUS_CODE) {
    super(message);
    this.code = code;
  }
}

export class DatabaseConnectionError extends InternalException {
  constructor() {
    super(
      `Error connecting to the database.`,
      HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR
    );
  }
}