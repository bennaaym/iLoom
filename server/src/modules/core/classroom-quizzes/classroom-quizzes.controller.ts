import {Body, Controller, Get, Param, Post} from '@nestjs/common';
import {ClassroomQuizzesService} from './classroom-quizzes.service';
import {CreateQuizDto} from './dtos';
import {CurrentUser, Roles} from '@common/decorators';
import {UserDocument} from '../users/user.schema';
import {EUserRole} from '@common/types';

@Controller('classroom-quizzes')
export class ClassroomQuizzesController {
  constructor(
    private readonly classroomQuizzesService: ClassroomQuizzesService
  ) {}

  @Post()
  create(@Body() dto: CreateQuizDto, @CurrentUser() user: UserDocument) {
    return this.classroomQuizzesService.create(dto, user);
  }

  @Get('results/:classroomId/:materialId')
  @Roles(EUserRole.ADMIN, EUserRole.TEACHER)
  listQuizResults(
    @Param('classroomId') classroomId: string,
    @Param('materialId') materialId: string,
    @CurrentUser() user: UserDocument
  ) {
    return this.classroomQuizzesService.listQuizResults(
      classroomId,
      materialId,
      user
    );
  }
}
