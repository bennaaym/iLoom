import {ExplicityAny} from '@common/types';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsString
} from 'class-validator';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  teacher: string;

  @IsString()
  @IsNotEmpty()
  classroom: string;

  @IsString()
  @IsNotEmpty()
  material: string;

  @IsObject()
  @IsNotEmptyObject()
  answers: Record<string, ExplicityAny>;
}
