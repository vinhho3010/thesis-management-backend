import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PendingClassService } from './pending-class.service';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import { PendingClassList } from 'src/schemas/pending-class.schema';

@Controller('/api/pending-class')
export class PendingClassController {
  constructor(private pendingClassService: PendingClassService) {}

  @Post()
  create(@Body() newPendingClass: PendingClassDto): Promise<PendingClassList> {
    return this.pendingClassService.registerToClass(newPendingClass);
  }

  @Get('/class/:id')
  findOneClassPendingList(
    @Param('id') id: string,
  ): Promise<PendingClassList[]> {
    return this.pendingClassService.findListByClassId(id);
  }

  @Put('/:id')
  updatePendingList(
    @Param('id') id: string,
    @Body() updatePendingClass: PendingClassDto,
  ) {
    return this.pendingClassService.updatePendingList(id, updatePendingClass);
  }

  @Get('/:id/approve')
  acceptPendingList(@Param('id') id: string) {
    return this.pendingClassService.approvePending(id);
  }

  @Get('/:id/reject')
  rejectPendingList(@Param('id') id: string) {
    return this.pendingClassService.rejectPending(id);
  }

  @Get('/student/:id')
  findPendingListByStudentId(@Param('id') id: string) {
    return this.pendingClassService.findPendingListByStudentId(id);
  }

  @Delete(':id')
  deletePendingList(@Param('id') id: string) {
    return this.pendingClassService.deletePendingList(id);
  }
}
