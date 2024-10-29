import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document, Types} from 'mongoose';
import {User} from '@modules/core/users/user.schema';
import {Classroom} from '../classrooms/classroom.schema';
import {EMaterialScope, EMaterialSubject, EMaterialActivity} from './types';
import {ExplicityAny} from '@common/types';

@Schema({timestamps: true})
export class Material {
  @Prop({type: Types.ObjectId, ref: User.name, required: true})
  user: Types.ObjectId;

  @Prop({type: Types.ObjectId, ref: Classroom.name, default: null})
  classroom: string;

  @Prop({enum: EMaterialScope, required: true})
  scope: EMaterialScope;

  @Prop({enum: EMaterialSubject, required: true})
  subject: EMaterialSubject;

  @Prop({enum: EMaterialActivity, required: true})
  activity: EMaterialActivity;

  @Prop({type: mongoose.Schema.Types.Mixed, required: true})
  content: Record<string, ExplicityAny>;

  @Prop()
  contentPdf: string;

  @Prop()
  imageUrl: string;
}

export type MaterialDocument = Material & Document;
export const MaterialSchema = SchemaFactory.createForClass(Material);
