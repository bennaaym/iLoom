import {
  IsDateString,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength
} from 'class-validator';

export class CreateClassroomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;

  @IsDateString()
  startDate: string;

  @IsNumber()
  @Min(15)
  @Max(120)
  duration: number;

  @IsNumber()
  @Min(1)
  @Max(10)
  capacity: number;
}
