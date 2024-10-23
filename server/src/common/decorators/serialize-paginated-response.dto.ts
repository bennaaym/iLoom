import {ExplicityAny} from '@common/types';
import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors
} from '@nestjs/common';
import {ClassConstructor, Expose, plainToClass} from 'class-transformer';
import {Observable, map} from 'rxjs';

class MetaDto {
  @Expose()
  total: number;
  @Expose()
  perPage: number;
  @Expose()
  page: number;
  @Expose()
  pages: number;
}

class SerializePaginatedResponseInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}
  intercept(
    _: ExecutionContext,
    next: CallHandler<ExplicityAny>
  ): Observable<ExplicityAny> {
    return next.handle().pipe(
      map((data: ExplicityAny) => {
        return {
          data: plainToClass(this.dto, data.data, {
            excludeExtraneousValues: true
          }),
          meta: plainToClass(MetaDto, data.meta, {
            excludeExtraneousValues: true
          })
        };
      })
    );
  }
}

export const SerializePaginatedResponse = <T>(dto: ClassConstructor<T>) => {
  return UseInterceptors(new SerializePaginatedResponseInterceptor(dto));
};
