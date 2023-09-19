import { MajorService } from './major.service';
import { MajorController } from './major.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Major, MajorSchema } from 'src/schemas/major.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Major.name, schema: MajorSchema }]),
  ],
  controllers: [MajorController],
  providers: [MajorService],
})
export class MajorModule {}
