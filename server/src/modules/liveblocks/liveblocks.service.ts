import {lodash} from '@libs';
import {Liveblocks} from '@liveblocks/node';
import {ConfigService} from '@modules/config';
import {ClassroomDocument} from '@modules/core/classrooms/classroom.schema';
import {UserDocument} from '@modules/core/users/user.schema';
import {Injectable} from '@nestjs/common';

@Injectable()
export class LiveblocksService {
  private readonly liveblocks;

  constructor(configService: ConfigService) {
    this.liveblocks = new Liveblocks({
      secret: configService.liveblocks.secret
    });
  }

  async createSession({
    user,
    classroom
  }: {
    user: UserDocument;
    classroom: ClassroomDocument;
  }) {
    const session = this.liveblocks.prepareSession(user.id, {
      userInfo: lodash.pick(user, ['name', 'role'])
    });

    session.allow(
      classroom.shareableCode,
      classroom.teacher === user.id ? session.FULL_ACCESS : session.READ_ACCESS
    );

    const {body} = await session.authorize();

    return JSON.parse(body);
  }

  async createRoom(classroom: ClassroomDocument) {
    return this.liveblocks.createRoom(classroom.shareableCode, {
      defaultAccesses: [],
      metadata: {
        name: classroom.name,
        teacher: classroom.teacher
      }
    });
  }
}
