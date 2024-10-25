import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.schema';

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  sender: Types.ObjectId;

  @Prop({ required: true })
  senderName: string;

  @Prop({ required: true })
  classroomId: string;

  @Prop({ required: true })
  content: string;
}

export type ChatMessageDocument = ChatMessage & Document;
export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
