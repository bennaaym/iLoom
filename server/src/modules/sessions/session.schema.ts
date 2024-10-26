import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema({timestamps: true})
export class Session {
  @Prop({type: String, _id: true})
  _id: string;

  @Prop({required: true})
  expires: Date;

  @Prop({required: true})
  session: string;
}

export type SessionDocument = Session & Document;
export const SessionSchema = SchemaFactory.createForClass(Session);
