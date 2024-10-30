import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ClassroomQuiz, ClassroomQuizDocument} from './classroom-quiz.schema';

@Injectable()
export class ClassroomQuizzesRepository extends BaseRepository<ClassroomQuizDocument> {
  constructor(
    @InjectModel(ClassroomQuiz.name)
    readonly modelRef: Model<ClassroomQuizDocument>
  ) {
    super(modelRef);
  }
}
