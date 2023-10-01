import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';

export type RefDocsDocument = HydratedDocument<refDocs>;

@Schema()
export class refDocs {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  type: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;
}

export const refDocsSchema = SchemaFactory.createForClass(refDocs);
