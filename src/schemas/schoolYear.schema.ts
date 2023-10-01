import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SchoolYearDocument = HydratedDocument<SchoolYear>;

@Schema()
export class SchoolYear {
  @Prop({ required: true })
  schoolYear: string;
}

export const SchoolYearSchema = SchemaFactory.createForClass(SchoolYear);
