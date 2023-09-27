import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
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
    return this.classModel.find().populate('teacher', 'fullName email').exec();
  }

  async findOneById(id: string): Promise<Class> {
    const classDetail = await this.classModel
      .findById(id)
      .populate('teacher', 'fullName email')
      .populate('student')
      .exec();
    if (!classDetail) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }
    return classDetail;
  }

  async create(classDto: ClassDto): Promise<Class> {
    const { teacher, semester, schoolYear } = classDto;
    const existedClass = await this.classModel.findOne({
      teacher: teacher,
      semester: semester,
      schoolYear: schoolYear,
    });
    if (existedClass) {
      throw new HttpException('Giảng viên đã tạo nhóm trong học kỳ này', 409);
    }
    const newClass = await this.classModel.create(classDto);
    return newClass;
  }

  async deleteClassById(id: string): Promise<Class> {
    const existClass = await this.classModel.findById({ _id: id });
    if (!existClass) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }
    return await this.classModel.findByIdAndDelete(id);
  }

  async updateClassById(id: string, classDto: ClassDto): Promise<Class> {
    const existClass = this.classModel.findById({ _id: id });
    if (!existClass) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }
    return await this.classModel.findByIdAndUpdate(id, classDto);
  }

  async addStudent(classId: string, studentId: any): Promise<Class> {
    const currentClass = await this.classModel.findById(classId);
    if (!currentClass) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }

    const studentListId = currentClass.student.map((student: any) =>
      student._id.toString(),
    );
    if (studentListId.includes(studentId._id.toString())) {
      throw new HttpException('Sinh viên đã tồn tại trong lớp', 409);
    }
    const updatedClass = await this.classModel.findByIdAndUpdate(
      classId,
      { $addToSet: { student: studentId } },
      { new: true },
    );
    return updatedClass;
  }
}
