import { PendingClassService } from './pending-class.service';
import { PendingClassController } from './pending-class.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PendingClassList,
  PendingClassListSchema,
} from 'src/schemas/pending-class.schema';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PendingClassList.name, schema: PendingClassListSchema },
      { name: Class.name, schema: ClassSchema },
      { name: Thesis.name, schema: ThesisSchema },
    ]),
  ],
  controllers: [PendingClassController],
  providers: [PendingClassService],
})
export class PendingClassModule {}
