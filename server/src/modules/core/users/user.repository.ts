import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {User, UserDocument} from './user.schema';

@Injectable()
export class UserRepository extends BaseRepository<UserDocument> {
  constructor(
    @InjectModel(User.name)
    private readonly modelRef: Model<UserDocument>
  ) {
    super(modelRef);
  }
}
