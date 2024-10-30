import {Module} from '@nestjs/common';
import {ClassroomChatsService} from './classroom-chats.service';
import {ClassroomChatsRepository} from './classroom-chats.repository';
import {ClassroomChatsGateway} from './classroom-chats.gateway';
import {MongooseModule} from '@nestjs/mongoose';
import {ClassroomChat, ClassroomChatSchema} from './classroom-chat.schema';
import {SessionsModule} from '@modules/sessions';
import {UsersModule} from '@modules/core/users';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ClassroomChat.name, schema: ClassroomChatSchema}
    ]),

    SessionsModule,
    UsersModule
  ],
  providers: [
    ClassroomChatsService,
    ClassroomChatsRepository,
    ClassroomChatsGateway
  ]
})
export class ClassroomChatsModule {}
