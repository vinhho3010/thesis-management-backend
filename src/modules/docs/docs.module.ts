import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';

@Module({
  imports: [],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
