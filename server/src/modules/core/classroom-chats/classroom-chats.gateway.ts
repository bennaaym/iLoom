import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {Injectable, Logger, UseFilters, UseGuards} from '@nestjs/common';
import {ConfigService} from '@modules/config';
import {SessionsService} from '@modules/sessions';
import {UsersService} from '../users';
import {ClassroomChatsService} from './classroom-chats.service';
import {lodash} from '@libs';
import {socketAuth} from '@common/socket';
import {WebSocketExceptionFilter} from '@common/filters';
import {SocketAuthorizationGuard} from '@common/guards';

enum EClassroomChatEvent {
  MESSAGE = 'message',
  MESSAGES = 'messages'
}

@UseFilters(new WebSocketExceptionFilter())
@UseGuards(SocketAuthorizationGuard)
@Injectable()
@WebSocketGateway({
  namespace: 'classroom-chat',
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true
  }
})
export class ClassroomChatsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(ClassroomChatsGateway.name);

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
    private readonly classroomChatsService: ClassroomChatsService
  ) {}

  private async auth(socket: Socket) {
    return socketAuth({
      socket,
      configService: this.configService,
      sessionsService: this.sessionsService,
      usersService: this.usersService
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    await this.auth(socket);

    this.logger.log(`Client connected: ${socket.id}`);
    const messages = await this.classroomChatsService.list(socket.classroom);
    socket.join(socket.classroom);

    this.server.to(socket.classroom).emit(
      EClassroomChatEvent.MESSAGES,
      messages.map((message) => ({
        type: 'message',
        content: message.content,
        sender: lodash.pick(message.sender, ['id', 'name'])
      }))
    );
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @SubscribeMessage(EClassroomChatEvent.MESSAGE)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() content: string
  ) {
    this.server.to(socket.classroom).emit(EClassroomChatEvent.MESSAGE, {
      type: 'message',
      sender: lodash.pick(socket.currentUser, ['id', 'name']),
      content
    });

    await this.classroomChatsService.create({
      classroom: socket.classroom,
      sender: socket.currentUser.id,
      content
    });
  }
}
