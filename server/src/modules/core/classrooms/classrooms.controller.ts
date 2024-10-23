import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query
} from '@nestjs/common';
import {ClassroomsService} from './classrooms.service';
import {
  ClassroomDto,
  CreateClassroomDto,
  ListClassroomQuery,
  UpdateClassroomDto
} from './dtos';
import {
  CurrentUser,
  SerializePaginatedResponse,
  SerializeResponse
} from '@common/decorators';
import {UserDocument} from '@modules/core/users/user.schema';

@Controller('classrooms')
export class ClassroomsController {
  constructor(private readonly classroomsService: ClassroomsService) {}

  @Get()
  @SerializePaginatedResponse(ClassroomDto)
  list(@Query() query: ListClassroomQuery, @CurrentUser() user: UserDocument) {
    return this.classroomsService.list(query, user);
  }

  @Get(':id')
  @SerializeResponse(ClassroomDto)
  retrieve(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.classroomsService.retrieve(id, user);
  }

  @Post()
  @SerializeResponse(ClassroomDto)
  create(@Body() dto: CreateClassroomDto, @CurrentUser() user: UserDocument) {
    return this.classroomsService.create(dto, user);
  }

  @Patch(':id')
  @SerializeResponse(ClassroomDto)
  update(
    @Param('id') id: string,
    @Body() dto: UpdateClassroomDto,
    @CurrentUser() user: UserDocument
  ) {
    return this.classroomsService.update({id, dto, user});
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return this.classroomsService.delete(id, user);
  }
}
