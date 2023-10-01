import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SemesterDocument = HydratedDocument<Semester>;

@Schema()
export class Semester {
  @Prop({ required: true })
  semester: string;
}

export const SemesterSchema = SchemaFactory.createForClass(Semester);
