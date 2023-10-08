import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Class } from './class.schema';

export type RefDocsDocument = HydratedDocument<refDocs>;

@Schema({ timestamps: true })
export class refDocs {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop()
  url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;
}

export const refDocsSchema = SchemaFactory.createForClass(refDocs);
