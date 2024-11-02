import {socketAuth} from '@common/socket';
import {ConfigService} from '@modules/config';
import {SessionsService} from '@modules/sessions';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {UsersService} from '../users';
import {Logger} from '@nestjs/common';
import {ClassroomsService} from './classrooms.service';
import {Roles} from '@common/decorators';
import {EUserRole} from '@common/types';

enum EClassroomEvent {
  END_CLASSROOM = 'end-classroom'
}

@WebSocketGateway({
  namespace: 'classroom',
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true
  }
})
export class ClassroomsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger(ClassroomsGateway.name);
  @WebSocketServer() server: Server;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly classroomsService: ClassroomsService
  ) {}
  async handleConnection(@ConnectedSocket() socket: Socket) {
    await this.auth(socket);

    this.logger.log(`Client connected: ${socket.id}`);
    socket.join(socket.classroom);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }
  private async auth(socket: Socket) {
    return socketAuth({
      socket,
      configService: this.configService,
      sessionsService: this.sessionsService,
      usersService: this.usersService
    });
  }

  @Roles(EUserRole.ADMIN, EUserRole.TEACHER)
  @SubscribeMessage(EClassroomEvent.END_CLASSROOM)
  async handleEndClassroom(@ConnectedSocket() socket: Socket) {
    await this.classroomsService.endClassroom(
      socket.classroom,
      socket.currentUser
    );
    this.server.to(socket.classroom).emit(EClassroomEvent.END_CLASSROOM, {
      reason: 'teacher'
    });
  }
}
