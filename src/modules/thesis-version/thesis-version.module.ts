import { ThesisVersionService } from './thesis-version.service';
import { ThesisVersionController } from './thesis-version.controller';

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ThesisVersion, ThesisVersionSchema } from 'src/schemas/thesis-version.schema';
import { Comment, CommentSchema } from 'src/schemas/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: ThesisVersion.name, schema: ThesisVersionSchema},
      {name: Comment.name, schema: CommentSchema}
    ]),
  ],
  controllers: [ThesisVersionController],
  providers: [ThesisVersionService],
})
export class ThesisVersionModule {}
