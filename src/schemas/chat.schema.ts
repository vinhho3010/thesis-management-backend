import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Message } from './message.schema';

export type ChatDocument = HydratedDocument<Chat>;

@Schema({ timestamps: true })
export class Chat {
  
  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], required: true})
  participants: User[];
 
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }] })
  messages: Message[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
