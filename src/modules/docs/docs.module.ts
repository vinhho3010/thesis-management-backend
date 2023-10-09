import { Module } from '@nestjs/common';
import { DocsController } from './docs.controller';
import { DocsService } from './docs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { refDocs, refDocsSchema } from 'src/schemas/refDocs.schema';
import { refDocsType, refDocsTypeSchema } from 'src/schemas/refDocType.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: refDocs.name, schema: refDocsSchema }, { name: refDocsType.name, schema: refDocsTypeSchema }]),
  ],
  controllers: [DocsController],
  providers: [DocsService],
})
export class DocsModule {}
