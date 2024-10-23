import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Session
} from '@nestjs/common';
import {AuthService} from './auth.service';
import {SignInDto, SignUpDto} from './dtos';
import {UserSession} from '@common/types';
import {PublicRoute, SerializeResponse} from '@common/decorators';
import {BasicUserDto} from '../users/dtos';
import {Request, Response} from 'express';
import {OAuth, OAuthCallback} from './decorators';
import {ConfigService} from '@modules/config';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService
  ) {}

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

  @PublicRoute()
  @OAuth('google')
  @Get('/google')
  google() {}

  @PublicRoute()
  @OAuthCallback('google')
  @Get('/google/callback')
  async googleCallback(
    @Req() req: Request,
    @Res() res: Response,
    @Session() session: UserSession
  ) {
    const user = await this.authService.oauth('google', req.oauthUser);
    session.userId = user.id;
    res.redirect(this.config.clientAppURL);
  }
}
