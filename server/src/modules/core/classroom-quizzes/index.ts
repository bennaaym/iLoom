import {Module} from '@nestjs/common';
import {ClassroomQuizzesService} from './classroom-quizzes.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ClassroomQuiz, ClassroomQuizSchema} from './classroom-quiz.schema';
import {ClassroomQuizzesRepository} from './classroom-quizzes.repository';
import {ClassroomQuizzesGateway} from './classroom-quizzes.gateway';
import {MaterialsModule} from '@modules/core/materials';
import {ClassroomQuizzesController} from './classroom-quizzes.controller';
import {SessionsModule} from '@modules/sessions';
import {UsersModule} from '../users';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ClassroomQuiz.name, schema: ClassroomQuizSchema}
    ]),
    MaterialsModule,
    SessionsModule,
    UsersModule
  ],
  controllers: [ClassroomQuizzesController],
  providers: [
    ClassroomQuizzesService,
    ClassroomQuizzesRepository,
    ClassroomQuizzesGateway
  ]
})
export class ClassroomQuizzesModule {}
