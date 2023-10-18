import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Milestone, MilestoneSchema } from 'src/schemas/milestone.schema';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { ThesisVersion, ThesisVersionSchema } from 'src/schemas/thesis-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Milestone.name, schema: MilestoneSchema },
      {name: Class.name, schema: ClassSchema},
      {name: ThesisVersion.name, schema: ThesisVersionSchema}
    ]),
  ],
  controllers: [MilestoneController],
  providers: [MilestoneService],
})
export class MilestoneModule {}
