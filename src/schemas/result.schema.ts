import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type ClassDocument = HydratedDocument<Result>;

@Schema()
export class Result {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacher!: User;

  @Prop({ required: true })
  mark!: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Thesis' })
  thesis!: string;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
