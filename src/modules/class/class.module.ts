import { ClassService } from './class.service';
import { ClassController } from './class.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/schemas/class.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { PendingClassList, PendingClassListSchema } from 'src/schemas/pending-class.schema';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';
import { Milestone, MilestoneSchema } from 'src/schemas/milestone.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Class.name, schema: ClassSchema },
      { name: User.name, schema: UserSchema },
      {name: PendingClassList.name, schema: PendingClassListSchema},
      {name: Thesis.name, schema: ThesisSchema},
      {name: Milestone.name, schema: MilestoneSchema}
    ]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
