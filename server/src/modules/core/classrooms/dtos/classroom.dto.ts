import {Expose} from 'class-transformer';

export class ClassroomDto {
  @Expose()
  id: string;

  @Expose()
  teacher: string;

  @Expose()
  name: string;

  @Expose()
  startDate: Date;

  @Expose()
  endDate: Date;

  @Expose()
  duration: string;

  @Expose()
  capacity: string;

  @Expose()
  shareableCode: string;

  @Expose()
  transcript: string;

  @Expose()
  summary: string;
}
