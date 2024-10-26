import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {ClassroomChat, ClassroomChatDocument} from './classroom-chat.schema';

@Injectable()
export class ClassroomChatsRepository extends BaseRepository<ClassroomChatDocument> {
  constructor(
    @InjectModel(ClassroomChat.name)
    readonly modelRef: Model<ClassroomChatDocument>
  ) {
    super(modelRef);
  }
}
