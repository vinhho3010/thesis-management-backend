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
import { ResponseData } from 'src/global/globalClass';
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
  create(@Body() newClass: ClassDto): ResponseData<Promise<Class>> {
    return new ResponseData(
      this.classService.create(newClass),
      'Class created',
      201,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): ResponseData<Promise<Class>> {
    return new ResponseData(
      this.classService.findOneById(id),
      'Class found',
      200,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateClass: ClassDto,
  ): ResponseData<Promise<Class>> {
    return new ResponseData(
      this.classService.updateClassById(id, updateClass),
      'Class updated',
      200,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): ResponseData<Promise<Class>> {
    return new ResponseData(
      this.classService.deleteClassById(id),
      'Class deleted',
      200,
    );
  }
}
