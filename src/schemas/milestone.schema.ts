import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ThesisVersion } from './thesis-version.schema';
import { Class } from './class.schema';

export type MilestoneDocument = HydratedDocument<Milestone>;

@Schema()
export class Milestone {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }] })
  comments: Comment[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ThesisVersion' }] })
  thesisVersionList: ThesisVersion[];
  _id: any;

}

export const MilestoneSchema = SchemaFactory.createForClass(Milestone);
