import { PendingClassService } from './pending-class.service';
import { PendingClassController } from './pending-class.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PendingClassList,
  PendingClassListSchema,
} from 'src/schemas/pending-class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PendingClassList.name, schema: PendingClassListSchema },
    ]),
  ],
  controllers: [PendingClassController],
  providers: [PendingClassService],
})
export class PendingClassModule {}
