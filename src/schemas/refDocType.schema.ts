import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { refDocs } from './refDocs.schema';
import { Class } from './class.schema';

export type refDocsTypeDocument = HydratedDocument<refDocsType>;

@Schema({timestamps: true})
export class refDocsType {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'refDocs' }] })
  refDocs: refDocs[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' , required: true})
  class: Class
}

export const refDocsTypeSchema = SchemaFactory.createForClass(refDocsType);
