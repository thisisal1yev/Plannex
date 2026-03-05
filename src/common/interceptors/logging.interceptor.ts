import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

/**
 * Logs every incoming request and its response time
 */
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { method, url } = context
      .switchToHttp()
      .getRequest<{ method: string; url: string }>();
    const now = Date.now();

    return next
      .handle()
      .pipe(
        tap(() => this.logger.log(`${method} ${url} — ${Date.now() - now}ms`)),
      );
  }
}
