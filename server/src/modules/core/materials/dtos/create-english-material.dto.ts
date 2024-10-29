import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {EMaterialActivity, EnglishLevel} from '../types';

export class CreateEnglishMaterialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  classroom: string;

  @IsEnum(EMaterialActivity)
  activity: EMaterialActivity;

  @IsEnum(EnglishLevel)
  level: EnglishLevel;
  @IsString()
  ageGroup: string;
  @IsString()
  description: string;
}
