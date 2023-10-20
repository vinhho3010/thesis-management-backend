import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from 'src/schemas/milestone.schema';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { ThesisVersion, ThesisVersionSchema } from 'src/schemas/thesis-version.schema';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
      {name: Class.name, schema: ClassSchema},
      {name: ThesisVersion.name, schema: ThesisVersionSchema},
      {name: Thesis.name, schema: ThesisSchema}
    ]),
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
})
export class MilestoneModule {}
