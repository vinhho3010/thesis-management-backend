import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
