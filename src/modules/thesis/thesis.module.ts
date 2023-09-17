import { ThesisController } from './thesis.controller';
import { ThesisService } from './thesis.service';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ThesisController],
  providers: [ThesisService],
})
export class ThesisModule {}
