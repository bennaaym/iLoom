import {BadRequestException, Injectable} from '@nestjs/common';
import {SignInDto, SignUpDto} from './dtos';
import {UsersService} from '@modules/core/users';
import {HashingUtil} from './utils';
import {OAuthStrategy, OAuthUser} from './strategies/oauth';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async signUp(dto: SignUpDto) {
    if (await this.usersService.isEmailTaken(dto.email))
      throw new BadRequestException('Email already taken');

    const password = await HashingUtil.hash(dto.password);
    const user = await this.usersService.create({...dto, password});
    return user;
  }

  async signIn(dto: SignInDto) {
    const user = await this.usersService.findByIdentifier('email', dto.email);
    if (!user) throw new BadRequestException('Invalid credentials');

    const isCorrectPassword = await HashingUtil.compare(
      dto.password,
      user.password
    );

    if (!isCorrectPassword)
      throw new BadRequestException('Invalid credentials');

    return user;
  }

  async oauth(strategy: OAuthStrategy, oauthUser: OAuthUser) {
    const user = await this.usersService.findByIdentifier(
      `${strategy}Id`,
      oauthUser.userId
    );

    if (user) return user;

    return this.usersService.create({
      email: oauthUser.email,
      name: oauthUser.name,
      password: await HashingUtil.hash(crypto.randomUUID().toString()),
      [`${strategy}Id`]: oauthUser.userId
    });
  }
}
