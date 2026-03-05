import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

/**
 * Global exception filter — standardizes all error responses
 * Handles HttpExceptions, Prisma errors, and generic errors
 */
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      if (typeof res === 'string') {
        message = res;
      } else if (typeof res === 'object' && res !== null) {
        const resObj = res as Record<string, unknown>;
        message = Array.isArray(resObj.message)
          ? (resObj.message as string[]).join(', ')
          : (resObj.message as string | undefined) || message;
      }

      code = HttpStatus[status] || 'HTTP_ERROR';
    } else {
      // Handle Prisma errors by checking error code
      interface PrismaError {
        code?: string;
        meta?: { target?: string };
      }
      const prismaError = exception as PrismaError;
      const prismaCode = prismaError?.code;

      if (prismaCode === 'P2025') {
        status = HttpStatus.NOT_FOUND;
        code = 'NOT_FOUND';
        message = 'Record not found';
      } else if (prismaCode === 'P2002') {
        status = HttpStatus.CONFLICT;
        code = 'CONFLICT';
        const target = prismaError?.meta?.target;
        message = target ? `${target} already exists` : 'Record already exists';
      } else if (prismaCode === 'P2003') {
        status = HttpStatus.BAD_REQUEST;
        code = 'FOREIGN_KEY_CONSTRAINT';
        message = 'Related record not found';
      } else {
        this.logger.error('Unhandled exception', exception);
      }
    }

    response.status(status).json({
      success: false,
      error: { code, message },
    });
  }
}
