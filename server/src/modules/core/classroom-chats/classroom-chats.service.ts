import {Injectable} from '@nestjs/common';
import {ClassroomChatsRepository} from './classroom-chats.repository';
@Injectable()
export class ClassroomChatsService {
  constructor(private readonly repository: ClassroomChatsRepository) {}

  list(classroom: string) {
    return this.repository.model.find({classroom}).populate('sender').exec();
  }

  create(attrs: {classroom: string; sender: string; content: string}) {
    return this.repository.create(attrs);
  }
}
