import {CurrentUser, SerializeResponse} from '@common/decorators';
import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import {BasicUserDto} from './dtos';
import {UserDocument} from './user.schema';
import {UsersService} from './users.service';
import {EUserRole} from '@common/types';
import {FileInterceptor} from '@nestjs/platform-express';
import csvParser from 'csv-parser';
import {Readable} from 'stream';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  @SerializeResponse(BasicUserDto)
  me(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Get('/students')
  async getStudents(@CurrentUser() teacher: UserDocument) {
    if (teacher.role !== EUserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can view their students');
    }
    return this.usersService.getStudents(teacher.id);
  }

  @Post('/students')
  @HttpCode(HttpStatus.NO_CONTENT)
  async createStudents(
    @Body() data: {students: Array<Partial<UserDocument>>},
    @CurrentUser() teacher: UserDocument
  ) {
    if (teacher.role !== EUserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can create students');
    }
    await this.usersService.createStudents(data, teacher.id);
  }

  @Post('/students-csv')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseInterceptors(FileInterceptor('file'))
  async uploadCsv(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() teacher: UserDocument
  ) {
    if (teacher.role !== EUserRole.TEACHER) {
      throw new ForbiddenException(
        'Only teachers can upload student CSV files'
      );
    }

    const students = await this.parseCsv(file.buffer);
    await this.usersService.createStudents({students}, teacher.id);
  }

  @Delete('/students/:id')
  @HttpCode(204)
  async deleteStudent(
    @Param('id') studentId: string,
    @CurrentUser() teacher: UserDocument
  ) {
    if (teacher.role !== EUserRole.TEACHER) {
      throw new ForbiddenException('Only teachers can delete students');
    }

    await this.usersService.deleteStudent(studentId, teacher.id);
  }

  private parseCsv(
    buffer: Buffer
  ): Promise<Array<{name: string; email: string; password: string}>> {
    return new Promise((resolve, reject) => {
      const students: Array<{name: string; email: string; password: string}> =
        [];
      const stream = Readable.from(buffer);
      stream
        .pipe(csvParser())
        .on('data', (data) => {
          const {name, email, password} = data;
          students.push({name, email, password});
        })
        .on('end', () => resolve(students))
        .on('error', (error) => reject(error));
    });
  }
}
