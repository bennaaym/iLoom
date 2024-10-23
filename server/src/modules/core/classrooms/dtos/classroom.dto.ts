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
  duration: string;

  @Expose()
  capacity: string;
}
