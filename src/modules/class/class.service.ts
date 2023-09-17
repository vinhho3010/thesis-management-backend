/*
https://docs.nestjs.com/providers#services
*/

import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassDto } from 'src/dtos/class/class-dto';
import { Class, ClassDocument } from 'src/schemas/class.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}

  async findAll(): Promise<Class[]> {
    return this.classModel.find().exec();
  }

  async findAllDetail(): Promise<Class[]> {
    return this.classModel.find().populate('teacher').exec();
  }

  async findOneById(id: string): Promise<Class> {
    return this.classModel.findById(id).exec();
  }

  async create(classDto: ClassDto): Promise<Class> {
    try {
      const newClass = await this.classModel.create(classDto);
      return newClass;
    } catch (error) {
      throw new HttpException(error, 409);
    }
  }

  async deleteClassById(id: string): Promise<Class> {
    return this.classModel.findByIdAndRemove(id);
  }

  async updateClassById(id: string, classDto: ClassDto): Promise<Class> {
    const existClass = this.classModel.findById({ _id: id });
    if (!existClass) {
      throw new HttpException('Class not found', 404);
    }
    return await this.classModel.findByIdAndUpdate(id, classDto);
  }
}
