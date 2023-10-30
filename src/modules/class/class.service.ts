import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { ClassDto } from 'src/dtos/class/class-dto';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { PendingClassList, PendingClassListDocument } from 'src/schemas/pending-class.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(PendingClassList.name) private readonly pendingClassModel: Model<PendingClassListDocument>,
    @InjectModel(Thesis.name) private readonly thesisModel: Model<ThesisDocument>,
    private configService: ConfigService,
  ) {}

  async findAllDetail(page: number, limit: number): Promise<any> {
    log(page, limit);
    const classDetail = await this.classModel
      .find()
      .populate('teacher', 'fullName email')
      .populate('student', 'fullName email code class')
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.classModel.countDocuments();
      return {
        data: classDetail,
        length: total,
        page: page,
        limit: limit,
      };
  }

  async findStudentById(id: string): Promise<User[]> {
    const classData = await this.classModel
      .findById(id)
      .populate({
        path: 'student',
        select: 'fullName code email class',
        populate: {
          path: 'major',
          select: 'name',
        }
      })
      const thesisOfClasses = await this.thesisModel.find({ class: id });
      const studentWithThesis =  classData.student.map((student: any) => {
      const matchingThesis = thesisOfClasses.find(thesis => thesis.student._id.toString() === student._id.toString());
        if (matchingThesis) {
          return {
            ...student.toObject(),
            thesis: {
              _id: matchingThesis._id,
              name: matchingThesis.name,
              topic: matchingThesis.topic,
              topicEng: matchingThesis.topicEng,
              status: matchingThesis.status,
            }
          };
        }
        return student.toObject();
      });

    return studentWithThesis;
  }

  async findOneById(id: string): Promise<Class> {
    const classDetail = await this.classModel
      .findById(id)
      .populate('teacher', 'fullName email')
      .populate('student', 'fullName email code class');
    
    if (!classDetail) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }
    
    const thesisOfClasses = await this.thesisModel.find({ class: id });
    const studentWithThesis =  classDetail.student.map((student: any) => {
    const matchingThesis = thesisOfClasses.find(thesis => thesis.student._id.toString() === student._id.toString());
      if (matchingThesis) {
        return {
          ...student.toObject(),
          thesis: {
            _id: matchingThesis._id,
            name: matchingThesis.name,
            topic: matchingThesis.topic,
            topicEng: matchingThesis.topicEng,
            status: matchingThesis.status,
          }
        };
      }
      return student.toObject();
    });
  
    return {
      ...classDetail.toObject(),
      student: studentWithThesis,
    };
  }

  //tạo nhóm mới
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
    //create new class
    const newClass = await this.classModel.create(classDto);
    await this.userModel.findByIdAndUpdate(teacher, {
      $addToSet: { instructClass: newClass._id },
    });
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
    const existClass = this.classModel.findById(id);
    if (!existClass) {
      throw new HttpException('Không tìm thấy lớp', 404);
    }
    return await this.classModel.findByIdAndUpdate(id, classDto);
  }

  //add student to class
  async addStudent(classId: string, student: any): Promise<Class> {
    const currentClass = await this.classModel.findById(classId);
    if (!currentClass) {
      throw new HttpException('Không tìm thấy nhóm', 404);
    }

    const studentExist = await this.userModel.findById(student._id);
    if (!studentExist) {
      throw new HttpException('Không tìm thấy sinh viên', 404);
    }

    const classExist = await this.classModel.findOne({
      student: { $in: [student._id] },
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });
    if (classExist) {
      throw new HttpException('Sinh viên đã có nhóm trong học kỳ này', 409);
    }

    const studentListId = currentClass.student.map((student: any) =>
      student._id.toString(),
    );
    if (studentListId.includes(student._id.toString())) {
      throw new HttpException('Sinh viên đã có trong nhóm', 409);
    }

    const updatedClass = await this.classModel.findByIdAndUpdate(
      classId,
      {
        $addToSet: { student },
      },
      { new: true },
    );

    return updatedClass;
  }

  async removeStudent(classId: string, studentId: string): Promise<Class> {
    try {
      await this.pendingClassModel.deleteMany({ student: studentId, class: classId });
      await this.userModel.findByIdAndUpdate(studentId, { $unset: { followClass: classId } });
      await this.thesisModel.deleteMany({ student: studentId, class: classId });
      return await  this.classModel.findByIdAndUpdate(
        classId,
        { $pull: { student: studentId } },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('Xoá sinh viên thất bại', 500);
    }
  }
}
