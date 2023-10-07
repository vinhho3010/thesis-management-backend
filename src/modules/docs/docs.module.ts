import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { refDocs, refDocsSchema } from 'src/schemas/refDocs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: refDocs.name, schema: refDocsSchema }]),
  ],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
