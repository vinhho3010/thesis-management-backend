import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Thesis } from './thesis.schema';

export type ProtectInfoDocument = HydratedDocument<ProtectInfo>;

@Schema()
export class ProtectInfo {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  room: string;

  @Prop({ required: true })
  time: string;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref:'Thesis', required: true })
  thesis: Thesis;
}

export const ProtectInfoSchema = SchemaFactory.createForClass(ProtectInfo);
