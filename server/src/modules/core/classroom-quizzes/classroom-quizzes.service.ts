import {Injectable} from '@nestjs/common';
import {ClassroomQuizzesRepository} from './classroom-quizzes.repository';
import {CreateQuizDto} from './dtos';
import {UserDocument} from '../users/user.schema';
import {MaterialsService} from '@modules/core/materials';
import {removeKeys} from '@common/utils';
import {ClassroomQuizDocument} from './classroom-quiz.schema';
import {MaterialDocument} from '../materials/material.schema';
import {ReadingActivity} from '../materials/types';
import {lodash} from '@libs';
import {ExplicityAny} from '@common/types';

@Injectable()
export class ClassroomQuizzesService {
  constructor(
    private readonly repository: ClassroomQuizzesRepository,
    private readonly materialService: MaterialsService
  ) {}

  async retrieveQuiz(materialId: string, user: UserDocument) {
    const material = await this.materialService.retrieve(materialId, user);
    return removeKeys(material.content, ['answer', 'answers']).questions;
  }

  create(dto: CreateQuizDto, user: UserDocument) {
    return this.repository.create({
      ...dto,
      student: user.id
    });
  }

  private calculateScore = (
    material: MaterialDocument,
    quiz: ClassroomQuizDocument
  ): number => {
    const {questions} = material.content as ReadingActivity;
    const answers = quiz.answers.at(0) as Record<string, string>;

    const correctAnswersCount = questions.reduce((count, question) => {
      return answers[question.question] === question.answer ? count + 1 : count;
    }, 0);

    return lodash.round((correctAnswersCount / questions.length) * 100, 2);
  };

  async listQuizResults(
    classroomId: string,
    materialId: string,
    user: UserDocument
  ) {
    const material = await this.materialService.retrieve(materialId, user);
    const quizzes = await this.repository.model
      .find({classroom: classroomId, teacher: user.id, material: materialId})
      .populate('student', 'name email');

    return quizzes.map((quiz) => {
      const score = this.calculateScore(material, quiz);
      const student = quiz.student as ExplicityAny as UserDocument;
      return lodash.omit(
        {
          id: quiz._id,
          ...quiz.toObject(),
          student: {...student.toObject(), id: student._id},
          score
        },
        ['_id', '__v', 'student._id']
      );
    });
  }
}
