import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ChatMessage, ChatMessageDocument} from './chat-message.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private chatMessageModel: Model<ChatMessageDocument>
  ) {}

  async createMessage(createMessageDto: {
    classroomId: string;
    senderName: string;
    sender: string;
    content: string;
  }) {
    const newMessage = new this.chatMessageModel(createMessageDto);
    return newMessage.save();
  }

  async findMessagesByClassroom(classroomId: string) {
    return this.chatMessageModel.find({classroomId}).exec();
  }
}
