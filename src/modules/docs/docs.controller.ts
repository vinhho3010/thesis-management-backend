import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { DocsService } from './docs.service';
import { refDocs } from 'src/schemas/refDocs.schema';

@Controller('/api/ref-docs')
export class DocsController {
  constructor(private readonly docsService: DocsService) {}

  @Get('class/:id')
  getDocsOfClass(@Param('id') id: string): Promise<refDocs[]> {
    return this.docsService.getDocsOfClass(id);
  }

  @Post()
  createDocs(@Body() createDocsDto: refDocs): Promise<refDocs> {
    return this.docsService.createDocs(createDocsDto);
  }

  @Delete(':id')
  deleteDocs(@Param('id') id: string): Promise<refDocs> {
    return this.docsService.deleteDocs(id);
  }

  @Get('type/:id')
  GetType(@Param('id') id: string): Promise<any> {
    return this.docsService.GetType(id);
  }

  @Get('class/:id/type')
  getDocsTypeInClass(
    @Param('id') classId: string,
  ): Promise<any[]> {
    return this.docsService.getDocsTypeInClass(classId);
  }

  @Get('type/:id/docs')
  getDocsOfType(@Param('id') id: string): Promise<refDocs[]> {
    return this.docsService.getDocsOfType(id);
  }

  @Post('class/:id/type')
  createDocsType(@Body() createDocsTypeDto: any): Promise<any> {
    return this.docsService.createDocsType(createDocsTypeDto);
  }

  @Delete('class/type/:id')
  deleteDocsType(@Param('id') id: string): Promise<any> {
    return this.docsService.deleteDocsType(id);
  }
}
