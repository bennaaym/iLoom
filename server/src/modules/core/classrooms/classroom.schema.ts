import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from '@modules/core/users/user.schema';
import {nanoid} from '@libs';

@Schema({timestamps: true})
export class Classroom {
  @Prop({type: Types.ObjectId, ref: User.name, required: true})
  teacher: Types.ObjectId;

  @Prop({required: true})
  name: string;

  @Prop({required: true})
  startDate: Date;

  @Prop({required: true})
  endDate: Date;

  @Prop({required: true})
  duration: number;

  @Prop({required: true})
  capacity: number;

  @Prop({unique: true, index: true, default: () => nanoid(10)})
  shareableCode: string;

  @Prop({default: ''})
  transcript: string;

  @Prop({default: ''})
  summary: string;
}

export type ClassroomDocument = Classroom & Document;
export const ClassroomSchema = SchemaFactory.createForClass(Classroom);
