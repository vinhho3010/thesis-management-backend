import { Prop, SchemaFactory, Schema } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from './user.schema';
import { ThesisVersion } from './thesis-version.schema';
import { Result } from './result.schema';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Class } from './class.schema';

export type ThesisDocument = HydratedDocument<Thesis>;

@Schema({ timestamps: true })
export class  Thesis {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  topicEng: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true  })
  class: Class;

  @Prop()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true  })
  student: User;

  @Prop({ required: true })
  topic: string;

  @Prop()
  type: string;

  @Prop()
  url: string;

  @Prop({ default: false})
  isCustomUrl: boolean;

  @Prop()
  customUrl: string;

  @Prop()
  customFileName: string;

  @Prop([{ type: mongoose.Schema.Types.ObjectId, ref: 'ThesisVersion' }])
  versions: ThesisVersion[];

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Result' }] })
  results: Result[];

  @Prop({ required: true })
  status: ThesisStatus;

  @Prop({ required: true })
  semester: string;

  @Prop({ required: true })
  schoolYear: string;

  @Prop()
  protectedAt: Date;

}

export const ThesisSchema = SchemaFactory.createForClass(Thesis);
