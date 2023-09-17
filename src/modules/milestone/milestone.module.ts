import { MilestoneService } from './milestone.service';
import { MilestoneController } from './milestone.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [MilestoneController],
  providers: [MilestoneService],
})
export class MilestoneModule {}
