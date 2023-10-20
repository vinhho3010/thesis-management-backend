import { ThesisVersionService } from './thesis-version.service';
import { ThesisVersionController } from './thesis-version.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThesisVersion, ThesisVersionSchema } from 'src/schemas/thesis-version.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ThesisVersion.name, schema: ThesisVersionSchema},
    ]),
  ],
  controllers: [ThesisVersionController],
  providers: [ThesisVersionService],
})
export class ThesisVersionModule {}
