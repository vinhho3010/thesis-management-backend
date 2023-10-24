import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Major } from './major.schema';
import { User } from './user.schema';
import { Thesis } from './thesis.schema';

export type CouncilDocument = HydratedDocument<Council>;

@Schema({ timestamps: true })
export class Council {
  @Prop({ required: true })
  name: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Major',  required: true })
  major: Major

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thesis' }] })
  thesisList: Thesis[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  president: User;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true})
  secretary: User;

  @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true})
  member: User;

  @Prop({required: true})
  schoolYear: string;

  @Prop({required: true})
  semester: string;

  _id?: any;

}

export const CouncilSchema = SchemaFactory.createForClass(Council);
