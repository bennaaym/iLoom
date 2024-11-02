import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from '@modules/core/users/user.schema';
import {dayjs, nanoid} from '@libs';
import {EClassroomStatus} from './types';

interface VirtualProperty {
  isFinished: boolean;
}

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

  @Prop({enum: EClassroomStatus, default: EClassroomStatus.ON_GOING})
  status: EClassroomStatus;

  @Prop({unique: true, index: true, default: () => nanoid(10)})
  shareableCode: string;

  @Prop({default: ''})
  transcript: string;

  @Prop({default: ''})
  summary: string;
}

export type ClassroomDocument = Classroom & Document & VirtualProperty;
export const ClassroomSchema = SchemaFactory.createForClass(Classroom);

ClassroomSchema.virtual('isFinished').get(function (this: ClassroomDocument) {
  const end = dayjs(this.endDate).utc();
  const now = dayjs().utc();

  return this.status === EClassroomStatus.FINISHED || end.isBefore(now);
});

ClassroomSchema.set('toJSON', {virtuals: true});
ClassroomSchema.set('toObject', {virtuals: true});
