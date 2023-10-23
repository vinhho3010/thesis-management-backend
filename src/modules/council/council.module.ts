import { CouncilService } from './council.service';
import { CouncilController } from './council.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Council, CouncilSchema } from 'src/schemas/council.schema';
import { Major, MajorSchema } from 'src/schemas/major.schema';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Council.name, schema: CouncilSchema},
    { name: Major.name, schema: MajorSchema},
    { name: Thesis.name, schema: ThesisSchema},
    { name: User.name, schema: UserSchema},
  ])],
  controllers: [CouncilController],
  providers: [CouncilService],
})
export class CouncilModule {}
