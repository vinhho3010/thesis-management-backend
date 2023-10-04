import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { Class } from './class.schema';
import { PendingStatus } from 'src/enums/pendingStatus.enum';

export type PendingClassListDocument = HydratedDocument<PendingClassList>;

@Schema()
export class PendingClassList {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  student: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class' })
  class: Class;

  @Prop({ required: true })
  status: PendingStatus;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  topic: string;

  @Prop()
  description?: string;

  @Prop()
  semester?: string;

  @Prop()
  schoolYear?: string;
}

export const PendingClassListSchema =
  SchemaFactory.createForClass(PendingClassList);
