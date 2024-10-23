import {Expose} from 'class-transformer';

export class BasicUserDto {
  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;
}
