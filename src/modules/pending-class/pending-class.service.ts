import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import { PendingStatus } from 'src/enums/pendingStatus.enum';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import {
  PendingClassList,
  PendingClassListDocument,
} from 'src/schemas/pending-class.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class PendingClassService {
  constructor(
    @InjectModel(PendingClassList.name)
    private readonly pendingClassListModel: Model<PendingClassListDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(Thesis.name)
    private readonly thesisModel: Model<ThesisDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async registerToClass(data: PendingClassDto): Promise<PendingClassList> {
    const existRegisterd = await this.pendingClassListModel.findOne({
      student: data.studentId,
      class: data.classId,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });

    if (existRegisterd) {
      throw new HttpException('Sinh viên đã đăng ký vào nhóm này', 409);
    }

    return await this.pendingClassListModel.create({
      student: data.studentId,
      class: data.classId,
      status: PendingStatus.PENDING,
      type: data.type,
      topic: data.topic,
      topicEng: data.topicEng,
      description: data.description,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });
  }

  async updatePendingList(
    id: string,
    updatePendingClass: PendingClassDto,
  ): Promise<PendingClassList> {
    const pendingItem = await this.pendingClassListModel.findById(id);

    if (pendingItem.status !== PendingStatus.PENDING) {
      throw new HttpException('Không thể cập nhật', 409);
    }

    return await this.pendingClassListModel.findByIdAndUpdate(
      id,
      updatePendingClass,
      { new: true },
    );
  }

  async findListByClassId(id: string): Promise<PendingClassList[]> {
    try {
      const pendingList = await this.pendingClassListModel
        .find({
          class: id,
          semester: this.configService.get('SEMESTER'),
          schoolYear: this.configService.get('SCHOOLYEAR'),
          status: PendingStatus.PENDING,
        })
        .populate({
          path: 'student',
          select: 'fullName code email class avatar',
          populate: {
            path: 'major',
            select: 'name',
          }
        });

      return pendingList;
    } catch (error) {
      throw new HttpException('Lỗi máy chủ', 500);
    }
  }

  async approvePending(id: string) {
    const pendingItem = await this.pendingClassListModel.findById(id);
    const result = await this.pendingClassListModel.findOneAndUpdate(
      { _id: id,},
      {status: PendingStatus.APPROVED,},
    );
    const restPendingList = await this.pendingClassListModel.find({
      student: pendingItem.student,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
      status: {$ne: PendingStatus.APPROVED}
    });

    //add student to class
    await this.classModel.findOneAndUpdate(
      { _id: pendingItem.class },
      { $push: { student: pendingItem.student } },
    );

    //add new thesis and assign for student
    await this.thesisModel.create({
      name: pendingItem.topic,
      topicEng: pendingItem.topicEng,
      class: pendingItem.class,
      student: pendingItem.student,
      topic: pendingItem.topic,
      type: pendingItem.type,
      description: pendingItem.description,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
      status: ThesisStatus.IN_PROGRESS,
    });

    await this.userModel.findOneAndUpdate(
      { _id: pendingItem.student },
      { followClass: pendingItem.class },
    );
    
    if(restPendingList.length > 0) {
      await this.pendingClassListModel.findByIdAndDelete(restPendingList.map(rest => rest._id));
    }
    return result;
  }

  rejectPending(id: string) {
    return this.pendingClassListModel.findOneAndUpdate(
      {
        _id: id,
      },
      {
        status: PendingStatus.REJECTED,
      },
    );
  }

  async findPendingListByStudentId(id: string) {
    return this.pendingClassListModel
      .find({
        student: id,
        semester: this.configService.get('SEMESTER'),
        schoolYear: this.configService.get('SCHOOLYEAR'),
      })
      .populate({
        path: 'class',
        select: 'name',
        populate: {
          path: 'teacher',
          select: 'fullName email major avatar',
        },
      });
  }

  async deletePendingList(id: string) {
    return this.pendingClassListModel.findByIdAndDelete(id);
  }
}
