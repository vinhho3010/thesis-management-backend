import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PendingClassService } from './pending-class.service';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import { PendingClassList } from 'src/schemas/pending-class.schema';
import { log } from 'console';

@Controller('/api/pending-class')
export class PendingClassController {
  constructor(private pendingClassService: PendingClassService) {}

  @Post()
  create(@Body() newPendingClass: PendingClassDto): Promise<PendingClassList> {
    return this.pendingClassService.registerToClass(newPendingClass);
  }

  @Get('/:id')
  findOneClassPendingList(
    @Param('id') id: string,
  ): Promise<PendingClassList[]> {
    return this.pendingClassService.findListByClassId(id);
  }

  @Get('/:id/approve')
  acceptPendingList(@Param('id') id: string) {
    log(id);
    return this.pendingClassService.approvePending(id);
  }
}
