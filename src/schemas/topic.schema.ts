import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type TopicDocument = HydratedDocument<Topic>;

@Schema()
export class Topic {
  @Prop()
  topic: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  user: User;

  @Prop()
  type: string;
}

export const TopicSchema = SchemaFactory.createForClass(Topic);
