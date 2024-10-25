import {Module} from '@nestjs/common';
import {ChatGateway} from './chat.gateway';
import {ChatService} from './chat.service';
import {MongooseModule} from '@nestjs/mongoose';
import {ChatMessage, ChatMessageSchema} from './chat-message.schema';
import {UsersModule} from '../users';
import { ClassroomsModule } from '../classrooms';
@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ChatMessage.name, schema: ChatMessageSchema}
    ]),
    UsersModule,
    ClassroomsModule 
  ],
  providers: [ChatGateway, ChatService],
  exports: [ChatService]
})
export class ChatModule {}
