import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

/**
 * Wraps all successful responses in a standard format:
 * { success: true, data, meta? }
 */
@Injectable()
export class ResponseTransformInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((payload: unknown) => {
        // Already paginated: { data: [], meta: {} }
        if (
          payload !== null &&
          typeof payload === 'object' &&
          'data' in payload &&
          'meta' in payload &&
          Array.isArray((payload as { data: unknown }).data)
        ) {
          const p = payload as { data: unknown[]; meta: unknown };
          return { success: true, data: p.data, meta: p.meta };
        }

        return { success: true, data: payload };
      }),
    );
  }
}
