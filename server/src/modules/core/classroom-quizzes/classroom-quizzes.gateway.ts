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
import {lodash} from '@libs';

enum EClassroomQuizEvent {
  START_QUIZ = 'start-quiz',
  END_QUIZ = 'end-quiz',
  SUBMIT_QUIZ = 'submit-quiz'
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
    return socketAuth({
      socket,
      configService: this.configService,
      usersService: this.userService,
      sessionsService: this.sessionService
    });
  }

  async handleConnection(@ConnectedSocket() socket: Socket) {
    await this.auth(socket);
    this.logger.log(`Client connected: ${socket.id}`);
    socket.join(socket.classroom);
    if (socket.currentUser.role !== EUserRole.STUDENT) {
      socket.join(`${socket.classroom}-${socket.currentUser.id}`);
    }
  }

  async handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`Client disconnected: ${socket.id}`);
  }

  @Roles(EUserRole.ADMIN, EUserRole.TEACHER)
  @SubscribeMessage(EClassroomQuizEvent.START_QUIZ)
  async handleStartQuiz(
    @ConnectedSocket() socket: Socket,
    @MessageBody() materialId: string
  ) {
    const questions = await this.classroomQuizzesService.retrieveQuiz(
      materialId,
      socket.currentUser
    );
    this.server.to(socket.classroom).emit(EClassroomQuizEvent.START_QUIZ, {
      teacher: socket.currentUser.id,
      material: materialId,
      classroom: socket.classroom,
      questions
    });
  }

  @Roles(EUserRole.ADMIN, EUserRole.TEACHER)
  @SubscribeMessage(EClassroomQuizEvent.END_QUIZ)
  async handleEndQuiz(@ConnectedSocket() socket: Socket) {
    this.server.to(socket.classroom).emit(EClassroomQuizEvent.END_QUIZ);
  }

  @Roles(EUserRole.ADMIN, EUserRole.STUDENT)
  @SubscribeMessage(EClassroomQuizEvent.SUBMIT_QUIZ)
  async handSubmitQuiz(@ConnectedSocket() socket: Socket) {
    this.server
      .to(`${socket.classroom}-${socket.currentUser.metadata.createdByTeacher}`)
      .emit(EClassroomQuizEvent.SUBMIT_QUIZ, {
        student: lodash.pick(socket.currentUser, [
          'id',
          'name',
          'email',
          'role'
        ])
      });
  }
}
