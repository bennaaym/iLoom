import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Session,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dtos';
import { UserSession } from '@common/types';
import { PublicRoute, SerializeResponse } from '@common/decorators';
import { BasicUserDto } from '../users/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicRoute()
  @SerializeResponse(BasicUserDto)
  @Post('sign-up')
  async signUp(@Body() dto: SignUpDto, @Session() session: UserSession) {
    const user = await this.authService.signUp(dto);
    session.userId = user.id;
    return user;
  }

  @PublicRoute()
  @SerializeResponse(BasicUserDto)
  @Post('sign-in')
  async signIn(@Body() dto: SignInDto, @Session() session: UserSession) {
    const user = await this.authService.signIn(dto);
    session.userId = user.id;
    return user;
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.NO_CONTENT)
  signOut(@Session() session: UserSession) {
    delete session.userId;
  }
}
