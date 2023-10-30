import {
  Controller,
  Param,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Query,
} from '@nestjs/common';
import { ClassService } from './class.service';
import { Class } from 'src/schemas/class.schema';
import { ClassDto } from 'src/dtos/class/class-dto';
import { User } from 'src/schemas/user.schema';

@Controller('api/class')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('majorId') majorId: string,
    @Query('schoolYear') schoolYear: string,
    @Query('semester') semester: string,
  ): Promise<Class[]> {
    return this.classService.findAllDetail(page, limit, majorId, schoolYear, semester);
  }

  @Post()
  create(@Body() newClass: ClassDto): Promise<Class> {
    return this.classService.create(newClass);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Class> {
    return this.classService.findOneById(id);
  }

  @Get(':id/student')
  findStudents(@Param('id') id: string): Promise<User[]> {
    return this.classService.findStudentById(id);
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
    @Body() student: User,
  ): Promise<Class> {
    return this.classService.addStudent(classId, student);
  }

  @Delete(':classId/remove-student/:studentId')
  removeStudent(
    @Param('classId') classId: string,
    @Param('studentId') studentId: string,
  ): Promise<Class> {
    return this.classService.removeStudent(classId, studentId);
  }
}
