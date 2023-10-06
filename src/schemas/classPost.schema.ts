import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Class } from './class.schema';

export type ClassPostDocument = HydratedDocument<ClassPost>;

@Schema({ timestamps: true })
export class ClassPost {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;

  @Prop({ required: true })
  content: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ClassPost' })
  replyTo: ClassPost;

  @Prop()
  CreateAt: Date;

  @Prop()
  UpdateAt: Date;
}

export const ClassPostSchema = SchemaFactory.createForClass(ClassPost);
