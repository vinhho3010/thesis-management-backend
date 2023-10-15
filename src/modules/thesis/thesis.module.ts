import { MongooseModule } from '@nestjs/mongoose';
import { ThesisController } from './thesis.controller';
import { ThesisService } from './thesis.service';

import { Module } from '@nestjs/common';
import { Thesis, ThesisSchema } from 'src/schemas/thesis.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Thesis.name, schema: ThesisSchema },
      { name: User.name, schema: UserSchema },
    ])
    ],
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}
