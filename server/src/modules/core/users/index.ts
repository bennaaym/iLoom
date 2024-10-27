import {forwardRef, Module} from '@nestjs/common';
import {UsersService} from './users.service';
import {UsersController} from './users.controller';
import {UserRepository} from './user.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {User, UserSchema} from './user.schema';
import { AuthModule } from '../auth';

@Module({
  imports: [MongooseModule.forFeature([{name: User.name, schema: UserSchema}]), forwardRef(() => AuthModule),],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService]
})
export class UsersModule {}
export {UsersService} from './users.service';
