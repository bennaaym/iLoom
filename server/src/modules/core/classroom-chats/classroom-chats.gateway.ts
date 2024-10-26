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
import {Injectable, Logger} from '@nestjs/common';
import {ConfigService} from '@modules/config';
import {SessionsService} from '@modules/sessions';
import {UsersService} from '../users';
import * as cookie from 'cookie';
import cookieParser from 'cookie-parser';
import {UserSession} from '@common/types';
import {UserDocument} from '../users/user.schema';
import {ClassroomChatsService} from './classroom-chats.service';
import {lodash} from '@libs';

declare module 'socket.io' {
  interface Socket {
    currentUser: UserDocument;
    classroom: string;
  }
}

enum EClassroomChatEvent {
  MESSAGE = 'message',
  MESSAGES = 'messages'
}

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
    try {
      const cookies = socket.handshake.headers.cookie;

      if (!cookies) return socket.disconnect();

      const parsedCookies = cookie.parse(cookies);
      const signedSessionId = parsedCookies['connect.sid'];

      const sessionId = cookieParser.signedCookie(
        signedSessionId,
        this.configService.sessionSecret
      );

      if (!sessionId) return socket.disconnect();

      const session = await this.sessionsService.getSession(sessionId);

      if (!session) return socket.disconnect();

      const {userId} = JSON.parse(session.session) as UserSession;

      const user = await this.usersService.findByIdentifier('id', userId);

      if (!user) return socket.disconnect();

      socket.currentUser = user;
      socket.classroom = socket.handshake.query.classroom as string;

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err: unknown) {}
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

  async handleDisconnect(socket: Socket) {
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
