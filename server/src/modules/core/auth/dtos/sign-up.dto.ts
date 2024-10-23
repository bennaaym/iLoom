import {IsString, MaxLength, MinLength} from 'class-validator';
import {SignInDto} from './sign-in.dto';

export class SignUpDto extends SignInDto {
  @IsString()
  @MinLength(3)
  @MaxLength(30)
  name: string;
}
