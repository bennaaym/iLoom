import {Module} from '@nestjs/common';
import {ClassroomQuizzesService} from './classroom-quizzes.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ClassroomQuiz, ClassroomQuizSchema} from './classroom-quiz.schema';
import {ClassroomQuizzesRepository} from './classroom-quizzes.repository';
import {ClassroomQuizzesGateway} from './classroom-quizzes.gateway';
import {MaterialsModule} from '@modules/core/materials';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ClassroomQuiz.name, schema: ClassroomQuizSchema}
    ]),
    MaterialsModule
  ],
  providers: [
    ClassroomQuizzesService,
    ClassroomQuizzesRepository,
    ClassroomQuizzesGateway
  ],
  exports: [ClassroomQuizzesGateway]
})
export class ClassroomQuizzesModule {}
