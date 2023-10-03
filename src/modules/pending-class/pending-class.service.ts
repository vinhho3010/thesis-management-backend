import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import {
  PendingClassList,
  PendingClassListDocument,
} from 'src/schemas/pending-class.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';

@Injectable()
export class PendingClassService {
  constructor(
    @InjectModel(PendingClassList.name)
    private readonly pendingClassListModel: Model<PendingClassListDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(Thesis.name)
    private readonly thesisModel: Model<ThesisDocument>,
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
      status: false,
      type: data.type,
      topic: data.topic,
      description: data.description,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    });
  }

  async findListByClassId(id: string): Promise<PendingClassList[]> {
    try {
      const pendingList = await this.pendingClassListModel
        .find({
          class: id,
          semester: this.configService.get('SEMESTER'),
          schoolYear: this.configService.get('SCHOOLYEAR'),
        })
        .populate('student');

      return pendingList;
    } catch (error) {
      throw new HttpException('Lỗi máy chủ', 500);
    }
  }

  async approvePending(id: string) {
    const pendingItem = await this.pendingClassListModel.findById(id);

    //add student to class
    await this.classModel.findOneAndUpdate(
      { _id: pendingItem.class },
      { $addToSet: { student: pendingItem.student } },
    );

    //add new thesis and assign for student
    await this.thesisModel.create({
      name: pendingItem.topic,
      class: pendingItem.class,
      student: pendingItem.student,
      topic: pendingItem.topic,
      type: pendingItem.type,
      description: pendingItem.description,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
      status: ThesisStatus.PROPOSED,
    });

    //remove pending item
    return await this.pendingClassListModel.findByIdAndDelete(id);
  }
}
