import {ExplicityAny} from '@common/types';
import {IsArray, IsNotEmpty, IsString} from 'class-validator';

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

  @IsArray()
  @IsNotEmpty()
  answers: Record<string, ExplicityAny>[];
}
