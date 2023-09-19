import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MajorDocument = HydratedDocument<Major>;

@Schema()
export class Major {
  @Prop()
  name: string;
}

export const MajorSchema = SchemaFactory.createForClass(Major);
