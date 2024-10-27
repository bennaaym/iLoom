import {EUserRole} from '@common/types';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import mongoose, {Document, Types } from 'mongoose';

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  name: string;

  @Prop({unique: true, required: true})
  email: string;

  @Prop({index: true})
  googleId: string;

  @Prop({required: true})
  password: string;

  @Prop({enum: EUserRole, default: EUserRole.TEACHER})
  role: string;

  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata: {
    createdByTeacher?: string; 
  };
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
