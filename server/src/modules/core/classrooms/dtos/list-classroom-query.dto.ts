import {PaginationQueryDto} from '@common/dtos';
import {IsIn, IsOptional} from 'class-validator';

export class ListClassroomQuery extends PaginationQueryDto {
  @IsOptional()
  @IsIn(['upcoming', 'past'])
  status: string;
}
