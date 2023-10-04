import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { ThesisVersion } from './thesis-version.schema';
import { Result } from './result.schema';
import { ThesisStatus } from 'src/enums/thesis-status.enum';

export type ThesisDocument = HydratedDocument<Thesis>;

@Schema({ timestamps: true })
export class Thesis {
  @Prop({ required: true })
  name: string;

  @Prop()
  nameEng: string;

  @Prop()
  summaryContent: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  student: User;

  @Prop()
  topic: string;

  @Prop()
  refUrl: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'Version' }])
  versions: ThesisVersion[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'result' }] })
  results: Result[];

  @Prop()
  status: ThesisStatus;

  @Prop() createAt: Date;

  @Prop() updateAt: Date;
}

export const ThesisSchema = SchemaFactory.createForClass(Thesis);
