import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class UpdateClassroomDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsOptional()
  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsNumber()
  @Min(15)
  @Max(120)
  duration: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  capacity: number;
}
