import {Module} from '@nestjs/common';
import {ClassroomsController} from './classrooms.controller';
import {ClassroomsService} from './classrooms.service';
import {ClassroomRepository} from './classrooms.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Classroom, ClassroomSchema} from './classroom.schema';
import {LiveblocksModule} from '@modules/liveblocks';
import {GoogleModule} from '@modules/google';
import {UsersModule} from '../users';
import {SessionsModule} from '@modules/sessions';
import {ClassroomsGateway} from './classrooms.gateway';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Classroom.name, schema: ClassroomSchema}
    ]),
    UsersModule,
    SessionsModule,
    LiveblocksModule,
    GoogleModule
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomRepository, ClassroomsGateway],
  exports: [ClassroomsService]
})
export class ClassroomsModule {}
export {ClassroomsService} from './classrooms.service';
