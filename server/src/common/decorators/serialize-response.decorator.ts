import {ExplicityAny} from '@common/types';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors
} from '@nestjs/common';
import {ClassConstructor, plainToClass} from 'class-transformer';
import {Observable, map} from 'rxjs';

class SerializeResponseInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    _: ExecutionContext,
    next: CallHandler<ExplicityAny>
  ): Observable<ExplicityAny> {
    return next.handle().pipe(
      map((data: ExplicityAny) => {
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true
        });
      })
    );
  }
}

export const SerializeResponse = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializeResponseInterceptor(dto));
};
