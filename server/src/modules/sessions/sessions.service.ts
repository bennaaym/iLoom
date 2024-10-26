import {Injectable} from '@nestjs/common';
import {SessionRepository} from './sessions.repository';

@Injectable()
export class SessionsService {
  constructor(private readonly repository: SessionRepository) {}

  getSession(id: string) {
    return this.repository.findById(id);
  }
}
