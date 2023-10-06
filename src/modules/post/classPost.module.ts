import { MongooseModule } from '@nestjs/mongoose';
import { ClassPostController } from './classPost.controller';
import { Module } from '@nestjs/common';
import { ClassPost, ClassPostSchema } from 'src/schemas/classPost.schema';
import { ClassPostService } from './classPost.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassPost.name, schema: ClassPostSchema },
    ]),
  ],
  controllers: [ClassPostController],
  providers: [ClassPostService],
})
export class PostModule {}
