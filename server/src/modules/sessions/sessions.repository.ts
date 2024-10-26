import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Session, SessionDocument} from './session.schema';

@Injectable()
export class SessionRepository extends BaseRepository<SessionDocument> {
  constructor(
    @InjectModel(Session.name)
    readonly modelRef: Model<SessionDocument>
  ) {
    super(modelRef);
  }
}
