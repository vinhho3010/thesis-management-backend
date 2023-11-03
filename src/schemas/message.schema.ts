import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  from: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  to: User;

  @Prop({required: true})
  message: string;

}

export const MessageSchema = SchemaFactory.createForClass(Message);
