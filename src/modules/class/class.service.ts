import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassDto } from 'src/dtos/class/class-dto';
import { PendingStatus } from 'src/enums/pendingStatus.enum';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Milestone, MilestoneDocument } from 'src/schemas/milestone.schema';
import { PendingClassList, PendingClassListDocument } from 'src/schemas/pending-class.schema';
import { ThesisVersion, ThesisVersionDocument } from 'src/schemas/thesis-version.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ClassService {
  constructor(
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(PendingClassList.name) private readonly pendingClassModel: Model<PendingClassListDocument>,
    @InjectModel(Thesis.name) private readonly thesisModel: Model<ThesisDocument>,
    @InjectModel(Milestone.name) private readonly milestoneModel: Model<MilestoneDocument>,
    private configService: ConfigService,
    @InjectModel(ThesisVersion.name) private readonly thesisVersionModel: Model<ThesisVersionDocument>,
  ) {}

  async findAllDetail(page: number, limit: number, majorId: string, schoolYear: string, semester: string): Promise<any> {
    const filters: any = {};
    if (majorId) {
      filters.major = majorId;
    }
    if (schoolYear) {
      filters.schoolYear = schoolYear;
    }
    if (semester) {
      filters.semester = semester;
    }
    const classDetail = await this.classModel
      .find(filters)
      .populate('teacher', 'fullName email avatar')
      .populate('student', 'fullName email code class avatar')
      .populate('major', 'name')
      .skip(page * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await this.classModel.countDocuments(filters);
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
        select: 'fullName code email class avatar',
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
      .populate('teacher', 'fullName email avatar')
      .populate('student', 'fullName email code class avatar');
    
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
    await this.userModel.findByIdAndUpdate(existClass.teacher, {
      $pull: { instructClass: existClass._id },
    });
    await this.userModel.updateMany(
      { _id: { $in: existClass.student } },
      { $unset: { followClass: existClass._id } },
    );
    await this.thesisModel.deleteMany({ class: id });
    await this.milestoneModel.deleteMany({ class: id });
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
    await this.pendingClassModel.deleteMany({ student: student._id, class: classId });
    await this.userModel.findByIdAndUpdate(student._id, {
      followClass: classId ,
    });
    await this.thesisModel.deleteMany({ student: student._id, semester: this.configService.get('SEMESTER'), schoolYear: this.configService.get('SCHOOLYEAR') });
    await this.thesisModel.create({
      student: student._id,
      class: classId,
      name: 'Chưa có',
      type: 'Chưa có',
      topic: 'Chưa có',
      topicEng: 'Not yet registered',
      status: ThesisStatus.IN_PROGRESS,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });

    await this.pendingClassModel.deleteMany({ student: student._id });
    await this.pendingClassModel.create({
      student: student._id,
      class: classId,
      status: PendingStatus.APPROVED,
      type: 'Chưa có',
      topic: 'Thêm bởi giáo vụ',
      topicEng: 'Not yet registered',
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });

    return updatedClass;
  }

  async removeStudent(classId: string, studentId: string): Promise<Class> {
    try {
      await this.pendingClassModel.deleteMany({ student: studentId, class: classId });
      await this.userModel.findByIdAndUpdate(studentId, { $unset: { followClass: classId } });
      await this.milestoneModel.updateMany({ student: studentId, class: classId }, { $unset: { student: studentId } });
      const studentThesis = await this.thesisModel.findOne({ student: studentId, class: classId });
      await this.thesisVersionModel.deleteMany({ student: studentId, thesis: studentThesis?._id });
      await this.thesisModel.deleteMany({ student: studentId, class: classId });
      return await this.classModel.findByIdAndUpdate(
        classId,
        { $pull: { student: studentId } },
        { new: true },
      );
    } catch (error) {
      throw new HttpException('Xoá sinh viên thất bại', 500);
    }
  }
}
