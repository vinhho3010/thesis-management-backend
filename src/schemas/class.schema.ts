import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { refDocs } from './refDocs.schema';

export type ClassDocument = HydratedDocument<Class>;

@Schema()
export class Class {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  student: User[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  teacher: User;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'refDocs' }] })
  refDocsList: refDocs[];

  // @Prop( type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }] )
  // postList: Post[];
}

export const ClassSchema = SchemaFactory.createForClass(Class);
