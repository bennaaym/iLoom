import {Module} from '@nestjs/common';
import {ClassroomsController} from './classrooms.controller';
import {ClassroomsService} from './classrooms.service';
import {ClassroomRepository} from './classrooms.repository';
import {MongooseModule} from '@nestjs/mongoose';
import {Classroom, ClassroomSchema} from './classroom.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Classroom.name, schema: ClassroomSchema}])
  ],
  controllers: [ClassroomsController],
  providers: [ClassroomsService, ClassroomRepository]
})
export class ClassroomsModule {}
export {ClassroomsService} from './classrooms.service';
