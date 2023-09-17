import { ThesisVersionService } from './thesis-version.service';
import { ThesisVersionController } from './thesis-version.controller';

import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [ThesisVersionController],
  providers: [ThesisVersionService],
})
export class ThesisVersionModule {}
