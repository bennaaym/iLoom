import {BaseRepository} from '@modules/database';
import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Classroom, ClassroomDocument} from './classroom.schema';

@Injectable()
export class ClassroomRepository extends BaseRepository<ClassroomDocument> {
  constructor(
    @InjectModel(Classroom.name)
    readonly modelRef: Model<ClassroomDocument>
  ) {
    super(modelRef);
  }
}
