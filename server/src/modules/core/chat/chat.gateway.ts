import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket
} from '@nestjs/websockets';
import {Server, Socket} from 'socket.io';
import {ChatService} from './chat.service';
import {UsersService} from '../users';
import {ClassroomsService} from '../classrooms';

@WebSocketGateway(4020, {
  namespace: '/chat',
  cors: {
    origin: 'http://localhost:3000',
    credentials: true
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly usersService: UsersService,
    private readonly classroomsService: ClassroomsService
  ) {}

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    @MessageBody()
    message: {classroomId: string; userId: string; content: string},
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.usersService.findByIdentifier('id', message.userId);

    if (!user || !client.rooms.has(message.classroomId)) {
      return;
    }

    const savedMessage = await this.chatService.createMessage({
      classroomId: message.classroomId,
      sender: user._id.toString(),
      senderName: user.name,
      content: message.content
    });

    this.server.to(message.classroomId).emit('newMessage', savedMessage);
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @MessageBody() message: {classroomId: string; userId: string},
    @ConnectedSocket() client: Socket
  ) {
    const user = await this.usersService.findByIdentifier('id', message.userId);

    if (!user) {
      return;
    }
    if (client.rooms.has(message.classroomId)) {
      return;
    }

    client.join(message.classroomId);

    const messages = await this.chatService.findMessagesByClassroom(
      message.classroomId
    );
    client.emit('roomMessages', messages);
  }
}
