import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Topic } from './topic.schema';

export type TopicTypeDocument = HydratedDocument<TopicType>;

@Schema()
export class TopicType {
  @Prop({ required: true })
  typeName: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' }] })
  correspondingTopics: Topic[];
}

export const TopicTypeSchema = SchemaFactory.createForClass(TopicType);
