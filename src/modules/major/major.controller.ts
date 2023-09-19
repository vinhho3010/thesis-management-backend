import { Controller, Get } from '@nestjs/common';
import { MajorService } from './major.service';

@Controller('api/majors')
export class MajorController {
  constructor(private readonly majorService: MajorService) {}

  @Get()
  getAll() {
    return this.majorService.getAll();
  }
}
