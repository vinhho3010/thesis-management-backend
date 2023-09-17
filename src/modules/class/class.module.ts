import { ClassService } from './class.service';
import { ClassController } from './class.controller';
/*
https://docs.nestjs.com/modules
*/

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Class, ClassSchema } from 'src/schemas/class.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Class.name, schema: ClassSchema }]),
  ],
  controllers: [ClassController],
  providers: [ClassService],
})
export class ClassModule {}
