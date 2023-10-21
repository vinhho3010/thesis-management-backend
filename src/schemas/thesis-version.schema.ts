import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Milestone } from './milestone.schema';
import { Thesis } from './thesis.schema';
import { User } from './user.schema';

export type ThesisVersionDocument = HydratedDocument<ThesisVersion>;

@Schema({ timestamps: true })
export class ThesisVersion {

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true })
  student: User

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Milestone', required: true })
  milestone: Milestone;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thesis', required: true })
  thesis: Thesis;

  @Prop({ required: true })
  semester: string;

  @Prop({ required: true })
  schoolYear: string;

  @Prop()
  url: string;

  @Prop()
  updateUrlAt: Date;

  @Prop()
  fileName: string;
}

export const ThesisVersionSchema = SchemaFactory.createForClass(ThesisVersion);
