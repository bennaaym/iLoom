import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document, Types} from 'mongoose';
import {User} from '../users/user.schema';
import {Classroom} from '../classrooms/classroom.schema';

@Schema({timestamps: true})
export class ClassroomChat {
  @Prop({type: Types.ObjectId, ref: User.name, required: true})
  sender: string;

  @Prop({type: Types.ObjectId, ref: Classroom.name, required: true})
  classroom: string;

  @Prop({required: true})
  content: string;
}

export type ClassroomChatDocument = ClassroomChat & Document;
export const ClassroomChatSchema = SchemaFactory.createForClass(ClassroomChat);
