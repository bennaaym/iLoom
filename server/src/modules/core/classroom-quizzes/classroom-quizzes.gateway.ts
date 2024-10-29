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
import {SessionsService} from '@modules/sessions';
import {UsersService} from '@modules/core/users';
import {ConfigService} from '@modules/config';
import {socketAuth} from '@common/socket';
import {SocketAuthorizationGuard} from '@common/guards';
import {Roles} from '@common/decorators';
import {EUserRole} from '@common/types';
import {WebSocketExceptionFilter} from '@common/filters';
import {ClassroomQuizzesService} from './classroom-quizzes.service';

enum EClassroomQuizEvent {
  START_QUIZ = 'start-quiz'
}

@UseFilters(new WebSocketExceptionFilter())
@UseGuards(SocketAuthorizationGuard)
@Injectable()
@WebSocketGateway({
  
  namespace: 'classroom-quiz',
  transports: ['websocket'],
  cors: {
    origin: '*',
    credentials: true
  }
})
export class ClassroomQuizzesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger(ClassroomQuizzesGateway.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly sessionService: SessionsService,
    private readonly userService: UsersService,
    private readonly classroomQuizzesService: ClassroomQuizzesService
  ) {}

  private async auth(socket: Socket) {
    socketAuth({
      socket,
      configService: this.configService,
      usersService: this.userService,
      sessionsService: this.sessionService
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    await this.auth(socket);
    this.logger.log(`Client connected: ${socket.id}`);
    console.log('=======> {}');
    socket.join(socket.classroom);
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @Roles(EUserRole.ADMIN, EUserRole.TEACHER)
  @SubscribeMessage(EClassroomQuizEvent.START_QUIZ)
  async handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() materialId: string
  ) {
    const quiz = await this.classroomQuizzesService.retrieveQuiz(
      materialId,
      socket.currentUser
    );
    console.log('quiz=====>', quiz);
    this.server.to(socket.classroom).emit(quiz);
  }
}
