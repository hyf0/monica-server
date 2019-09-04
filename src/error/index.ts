import { isDevelopment } from "../utils";

export class HttpError extends Error {
  public expose: boolean = true;
  public detail: string | undefined;
  constructor(
    public statusCode: number = 200,
    public title: string = '',
    detail?: string
  ) {
    super(`${title}${typeof detail === 'undefined' ? '' : `: ${detail}`}`);
    this.detail = undefined;
    if (typeof detail !== 'undefined') this.detail = detail;
  }
}

export function formatError(err: HttpError) {
  if (isDevelopment()) return {
    statusCode: err.statusCode,
    message: err.message,
    title: err.title,
    detail: typeof err.detail === 'undefined' ? null : err.detail,
    stack: err.stack,
  };
  return {
    statusCode: err.statusCode,
    message: err.message,
    title: err.title,
    detail: typeof err.detail === 'undefined' ? null : err.detail,
  };
}
