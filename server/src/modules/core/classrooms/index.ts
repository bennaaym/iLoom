import {Module} from '@nestjs/common';
import {ClassroomsController} from './classrooms.controller';
import {ClassroomsService} from './classrooms.service';
import {ClassroomRepository} from './classrooms.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Classroom, ClassroomSchema} from './classroom.schema';
import {LiveblocksModule} from '@modules/liveblocks';
import {GoogleModule} from '@modules/google';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: Classroom.name, schema: ClassroomSchema}
    ]),
    LiveblocksModule,
    GoogleModule
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomRepository],
  exports: [ClassroomsService]
})
export class ClassroomsModule {}
export {ClassroomsService} from './classrooms.service';
