import {IsNotEmpty, IsString} from 'class-validator';

export class TranscribeClassroomDto {
  @IsString()
  @IsNotEmpty()
  transcript: string;
}
