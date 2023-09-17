import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
