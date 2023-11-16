import { MongooseModule } from '@nestjs/mongoose';
import { ThesisController } from './thesis.controller';
import { ThesisService } from './thesis.service';

import { Module } from '@nestjs/common';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ThesisVersion, ThesisVersionSchema } from 'src/schemas/thesis-version.schema';
import { Result, ResultSchema } from 'src/schemas/result.schema';
import { Major, MajorSchema } from 'src/schemas/major.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thesis.name, schema: ThesisSchema },
      { name: User.name, schema: UserSchema },
      {name: ThesisVersion.name, schema: ThesisVersionSchema},
      {name: Result.name, schema: ResultSchema},
      {name: Major.name, schema: MajorSchema}
    ])
    ],
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}
