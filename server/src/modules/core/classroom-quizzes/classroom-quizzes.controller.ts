import {Body, Controller, Post} from '@nestjs/common';
import {ClassroomQuizzesService} from './classroom-quizzes.service';
import {CreateQuizDto} from './dtos';
import {CurrentUser} from '@common/decorators';
import {UserDocument} from '../users/user.schema';

@Controller('classroom-quizzes')
export class ClassroomQuizzesController {
  constructor(
    private readonly classroomQuizzesService: ClassroomQuizzesService
  ) {}

  @Post()
  create(@Body() dto: CreateQuizDto, @CurrentUser() user: UserDocument) {
    return this.classroomQuizzesService.create(dto, user);
  }
}
