import { Body, Controller, Post } from '@nestjs/common';
import { PendingClassService } from './pending-class.service';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import { PendingClassList } from 'src/schemas/pending-class.schema';

@Controller('api/pending-class')
export class PendingClassController {
  constructor(private pendingClassService: PendingClassService) {}

  @Post()
  create(@Body() newPendingClass: PendingClassDto): Promise<PendingClassList> {
    return this.pendingClassService.registerToClass(newPendingClass);
  }
}
