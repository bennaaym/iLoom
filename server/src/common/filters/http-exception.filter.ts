import {Env, ExplicityAny} from '@common/types';
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import {Request, Response} from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger: Logger;

  constructor(private readonly env: Env) {
    this.logger = new Logger();
  }
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Internal server error';

    const stack = (exception as ExplicityAny).stack;

    if (stack) {
      this.logger.error(stack);
    }

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message:
        (message as ExplicityAny)?.message ||
        message ||
        'Internal server error',
      stack: this.env !== Env.PRODUCTION ? stack : undefined
    };

    response.status(status).json(errorResponse);
  }
}
