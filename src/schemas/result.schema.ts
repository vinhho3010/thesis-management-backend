import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Thesis } from './thesis.schema';

export type ResultDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  teacher!: User;

  @Prop({ required: true })
  mark: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thesis', required: true })
  thesis: Thesis;

  _id: any;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
