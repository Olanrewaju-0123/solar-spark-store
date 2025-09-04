import type { Request, Response, NextFunction } from "express";

export interface AppError extends Error {
  status?: number;
  code?: string;
}

export function errorHandler(
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  // Log error for debugging
  console.error(`[${new Date().toISOString()}] Error ${status}: ${message}`);
  console.error(err.stack);

  // Consistent error response format
  res.status(status).json({
    error: {
      message,
      status,
      code: err.code || "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
    },
  });
}

// Custom error classes
export class ValidationError extends Error implements AppError {
  status = 400;
  code = "VALIDATION_ERROR";

  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends Error implements AppError {
  status = 404;
  code = "NOT_FOUND";

  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ConflictError extends Error implements AppError {
  status = 409;
  code = "CONFLICT";

  constructor(message: string) {
    super(message);
    this.name = "ConflictError";
  }
}

export class UnauthorizedError extends Error implements AppError {
  status = 401;
  code = "UNAUTHORIZED";

  constructor(message: string = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}
