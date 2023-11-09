import { MongooseModule } from '@nestjs/mongoose';
import { ClassPostController } from './classPost.controller';
import { Module } from '@nestjs/common';
import { ClassPost, ClassPostSchema } from 'src/schemas/classPost.schema';
import { ClassPostService } from './classPost.service';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ClassPost.name, schema: ClassPostSchema },
      { name: Comment.name, schema: CommentSchema}
    ]),
  ],
  controllers: [ClassPostController],
  providers: [ClassPostService],
})
export class PostModule {}
