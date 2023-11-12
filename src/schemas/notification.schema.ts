import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';

export type NotificationDocument = HydratedDocument<Notification>;

@Schema({ timestamps: true})
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  from: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  to: User;

  @Prop({ required: true })
  content: string;

  @Prop({default: false})
  isRead: boolean;

  @Prop()
  linkAction: string;

  @Prop({required: true})
  title: string;
  
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
