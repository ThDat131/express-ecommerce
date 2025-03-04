import type { Response } from 'express';

const StatusCode = {
  OK: 200,
  CREATED: 201,
};

const ReasonStatusCode = {
  OK: 'Success',
  CREATED: 'Created',
};

class SuccessResponse {
  message: string;
  status: number;
  reasonStatusCode: string;
  metadata: Object;
  constructor({
    message,
    statusCode = StatusCode.OK,
    reasonStatusCode = ReasonStatusCode.OK,
    metadata,
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata: Object;
  }) {
    this.message = !message ? reasonStatusCode : message;
    this.status = statusCode;
    this.reasonStatusCode = reasonStatusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class Created extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCode.CREATED,
    reasonStatusCode = ReasonStatusCode.CREATED,
    metadata,
  }: {
    message: string;
    statusCode?: number;
    reasonStatusCode?: string;
    metadata: Object;
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
  }
}

class Ok extends SuccessResponse {
  constructor({
    message,
    metadata,
  }: {
    message: string;
    statusCode: number;
    reasonStatusCode: string;
    metadata: Object;
  }) {
    super({ message, metadata });
  }
}

export { Created, Ok };
