import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { Class } from 'src/schemas/class.schema';
import { ClassDto } from 'src/dtos/class/class-dto';

@Controller('api/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  findAll(): Promise<Class[]> {
    return this.classService.findAllDetail();
  }

  @Post()
  create(@Body() newClass: ClassDto): Promise<Class> {
    return this.classService.create(newClass);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Class> {
    return this.classService.findOneById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClass: ClassDto,
  ): Promise<Class> {
    return this.classService.updateClassById(id, updateClass);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Class> {
    return this.classService.deleteClassById(id);
  }

  @Post(':classId/add-student')
  addStudent(
    @Param('classId') classId: string,
    @Body() studentId: string,
  ): Promise<Class> {
    return this.classService.addStudent(classId, studentId);
  }
}
