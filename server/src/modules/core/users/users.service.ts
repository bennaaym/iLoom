import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common';
import {UserRepository} from './user.repository';
import {UserDocument} from './user.schema';
import {EUserRole} from '@common/types';
import {SignUpDto} from '../auth/dtos';
import {AuthService} from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UserRepository,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ) {}

  async isEmailTaken(email: string) {
    return Boolean(await this.repository.findOne({email}));
  }

  findByIdentifier(identifier: 'id' | 'email' | 'googleId', value: string) {
    if (identifier === 'id') return this.repository.findById(value);
    return this.repository.findOne({[identifier]: value});
  }

  create(dto: Partial<UserDocument>) {
    return this.repository.create(dto);
  }
  async createStudents(
    data: {students: Array<Partial<SignUpDto>>},
    createdByTeacherId: any
  ) {
    for (const student of data.students) {
      const studentDto = {
        ...student,
        role: EUserRole.STUDENT,
        metadata: {
          createdByTeacher: createdByTeacherId
        }
      } as SignUpDto;

      await this.authService.signUp(studentDto);
    }
  }

  async getStudents(teacherId: string): Promise<any> {
    const students = await this.repository.findMany({
      role: EUserRole.STUDENT,
      'metadata.createdByTeacher': teacherId
    });

    return students.map((student) => ({
      id: student._id.toString(),
      name: student.name,
      email: student.email,
      role: student.role
    }));
  }

  async deleteStudent(studentId: string, teacherId: string): Promise<void> {
    const student = await this.repository.findById(studentId);

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    if (
      !student.metadata.createdByTeacher ||
      student.metadata.createdByTeacher.toString() !== teacherId
    ) {
      throw new ForbiddenException(
        'You do not have permission to delete this student'
      );
    }

    await this.repository.delete({_id: studentId});
  }
}
