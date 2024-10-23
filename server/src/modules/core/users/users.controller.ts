import {CurrentUser, SerializeResponse} from '@common/decorators';
import {Controller, Get} from '@nestjs/common';
import {BasicUserDto} from './dtos';
import {UserDocument} from './user.schema';

@Controller('users')
export class UsersController {
  @Get('/me')
  @SerializeResponse(BasicUserDto)
  me(@CurrentUser() user: UserDocument) {
    return user;
  }
}
