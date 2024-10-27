import {PaginationQueryDto} from '@common/dtos';
import { IsNotEmpty, IsOptional, IsString} from 'class-validator';

export class ListMaterialsQuery extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  classroom: string;
}
