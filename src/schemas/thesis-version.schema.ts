import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Milestone } from './milestone.schema';
import { Thesis } from './thesis.schema';

export type ThesisVersionDocument = HydratedDocument<ThesisVersion>;

@Schema()
export class ThesisVersion {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone' })
  milestone: Milestone;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thesis' })
  thesis: Thesis;

  @Prop({ required: true })
  version: string;
}

export const ThesisVersionSchema = SchemaFactory.createForClass(ThesisVersion);
