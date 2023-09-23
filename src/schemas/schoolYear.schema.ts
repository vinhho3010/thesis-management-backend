import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClassDocument = HydratedDocument<SchoolYear>;

@Schema()
export class SchoolYear {
  @Prop({ required: true })
  schoolYear: string;
}

export const SchoolYearSchema = SchemaFactory.createForClass(SchoolYear);
