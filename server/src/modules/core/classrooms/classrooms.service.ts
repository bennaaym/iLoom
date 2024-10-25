import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException
} from '@nestjs/common';
import {ClassroomRepository} from './classrooms.repository';
import {
  CreateClassroomDto,
  ListClassroomQuery,
  UpdateClassroomDto
} from './dtos';
import {UserDocument} from '../users/user.schema';
import {dayjs, lodash} from '@libs';
import {ExplicityAny} from '@common/types';
import {LiveblocksService} from '@modules/liveblocks';

@Injectable()
export class ClassroomsService {
  constructor(
    private readonly repository: ClassroomRepository,
    private readonly liveblocks: LiveblocksService
  ) {}

  private buildListFilter(query: ListClassroomQuery, user: UserDocument) {
    const queryFilter = lodash.pick(query, ['status']);
    let filter: Record<string, ExplicityAny> = {teacher: user.id};

    if (queryFilter.status && queryFilter.status === 'upcoming') {
      const now = dayjs().utc().toDate();
      filter = {
        ...filter,
        $or: [
          {startDate: {$gt: now}},
          {
            startDate: {$lte: now},
            endDate: {$gte: now}
          }
        ]
      };
    }

    if (queryFilter.status && queryFilter.status === 'past') {
      filter = {
        ...filter,
        endDate: {$lt: dayjs().utc().toDate()}
      };
    }
    return filter;
  }

  async list(query: ListClassroomQuery, user: UserDocument) {
    const pageOptions = lodash.pick(query, ['page', 'perPage']);

    return this.repository.paginate({
      filter: this.buildListFilter(query, user),
      orderBy: {startDate: 1, endDate: 1},
      pageOptions
    });
  }

  async retrieve(id: string, user: UserDocument) {
    const classroom = await this.repository.findById(id);
    if (!classroom) throw new NotFoundException();
    if (classroom.teacher !== user.id) throw new ForbiddenException();
    return classroom;
  }

  async create(dto: CreateClassroomDto, user: UserDocument) {
    const classroom = await this.repository.create({
      ...dto,
      teacher: user.id,
      startDate: dayjs(dto.startDate).utc().toDate(),
      endDate: dayjs(dto.startDate).add(dto.duration, 'minute').toDate()
    });
    await this.liveblocks.createRoom(classroom);
    return classroom;
  }

  async update({
    id,
    dto,
    user
  }: {
    id: string;
    dto: UpdateClassroomDto;
    user: UserDocument;
  }) {
    const classroom = await this.retrieve(id, user);

    if (dayjs().utc() > dayjs(classroom.startDate).utc()) {
      throw new UnprocessableEntityException(
        'Cannot update ongoing or past classes'
      );
    }

    if (lodash.isEmpty(dto)) return classroom;

    const startDate = dto.startDate
      ? dayjs(dto.startDate).utc()
      : dayjs(classroom.startDate).utc();
    const duration = dto.duration || classroom.duration;
    const endDate = startDate.add(duration, 'minute');

    return this.repository.update(id, {
      ...dto,
      startDate: startDate.toDate(),
      endDate: endDate.toDate()
    });
  }

  async delete(id: string, user: UserDocument) {
    return this.repository.delete({_id: id, teacher: user.id});
  }

  async setupWhiteboard(classroomCode: string, user: UserDocument) {
    const classroom = await this.repository.findOne({
      shareableCode: classroomCode
    });
    if (!classroom) throw new NotFoundException();

    return this.liveblocks.createSession({user, classroom});
  }
}
