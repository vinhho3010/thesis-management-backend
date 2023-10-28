import { MongooseModule } from '@nestjs/mongoose';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema}
    ])
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
