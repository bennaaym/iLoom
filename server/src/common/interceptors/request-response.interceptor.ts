import {ExplicityAny} from '@common/types';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor
} from '@nestjs/common';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class RequestResponseInterceptor implements NestInterceptor {
  private readonly logger = new Logger(RequestResponseInterceptor.name);

  intercept(
    context: ExecutionContext,
    next: CallHandler
  ): Observable<ExplicityAny> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const url = request.url;

    this.logger.verbose(
      `[Request] ${method} ${url} - ${new Date().toISOString()}`
    );

    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse();
        const statusCode = response.statusCode;
        this.logger.log(
          `[Response] ${method} ${url} ${statusCode} - ${Date.now() - now}ms`
        );
      })
    );
  }
}
