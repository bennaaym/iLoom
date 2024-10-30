import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document, Types} from 'mongoose';
import {User} from '../users/user.schema';
import {Classroom} from '../classrooms/classroom.schema';
import {Material} from '../materials/material.schema';
import {ExplicityAny} from '@common/types';

@Schema({timestamps: true})
export class ClassroomQuiz {
  @Prop({type: Types.ObjectId, ref: Classroom.name, required: true})
  classroom: string;

  @Prop({type: Types.ObjectId, ref: User.name, required: true})
  teacher: string;

  @Prop({type: Types.ObjectId, ref: User.name, required: true})
  student: string;

  @Prop({type: Types.ObjectId, ref: Material.name, required: true})
  material: string;

  @Prop({type: [mongoose.Schema.Types.Mixed], required: true})
  answers: Record<string, ExplicityAny>;
}

export type ClassroomQuizDocument = ClassroomQuiz & Document;
export const ClassroomQuizSchema = SchemaFactory.createForClass(ClassroomQuiz);
