import {Transform} from 'class-transformer';
import {IsNumber, IsOptional, Min} from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @Transform(({obj}) => Number(obj.perPage))
  @IsNumber()
  @Min(1)
  perPage: number;

  @IsOptional()
  @Transform(({obj}) => Number(obj.page))
  @IsNumber()
  @Min(1)
  page: number;
}

export class PaginatedResults<T> {
  data: T[];
  meta: {
    total: number;
    perPage: number;
    page: number;
    pages: number;
  };
}
