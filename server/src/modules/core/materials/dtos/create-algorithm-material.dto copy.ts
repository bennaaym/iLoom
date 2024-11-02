import {IsEnum, IsNotEmpty, IsOptional, IsString} from 'class-validator';
import {EMaterialActivity, AlgorithmLevel} from '../types';

export class CreateAlgorithmMaterialDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  classroom: string;

  @IsEnum(EMaterialActivity)
  activity: EMaterialActivity;

  @IsEnum(AlgorithmLevel)
  level: AlgorithmLevel;
  @IsString()
  topic: string;
  @IsString()
  description: string;
}
