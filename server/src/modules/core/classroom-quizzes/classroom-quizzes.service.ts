import {Injectable} from '@nestjs/common';
import {ClassroomQuizzesRepository} from './classroom-quizzes.repository';
import {CreateQuizDto} from './dtos';
import {UserDocument} from '../users/user.schema';
import {MaterialsService} from '@modules/core/materials';
import {removeKeys} from '@common/utils';

@Injectable()
export class ClassroomQuizzesService {
  constructor(
    private readonly repository: ClassroomQuizzesRepository,
    private readonly MaterialService: MaterialsService
  ) {}

  async retrieveQuiz(materialId: string, user: UserDocument) {
    const material = await this.MaterialService.retrieve(materialId, user);
    return removeKeys(material.content, ['answer', 'answers']).questions;
  }

  create(dto: CreateQuizDto, user: UserDocument) {
    return this.repository.create({
      ...dto,
      student: user.id
    });
  }
}
