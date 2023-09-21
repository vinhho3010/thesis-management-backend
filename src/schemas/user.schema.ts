import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { RoleEnum } from 'src/enums/role-enum';
import { Class } from './class.schema';
import { Topic } from './topic.schema';
import { Major } from './major.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  @Prop({ unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  role: RoleEnum;

  @Prop({ required: true })
  gender: string;

  @Prop({ required: true })
  code: string;

  @Prop()
  phoneNumber: string;

  @Prop()
  address: string;

  @Prop()
  avatar: string;

  @Prop()
  class: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Major' })
  major: Major;

  //student
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  followClass: Class;

  //teacher
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  instructClass: Class;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Topic' })
  Topic: Topic;
}

export const UserSchema = SchemaFactory.createForClass(User);
