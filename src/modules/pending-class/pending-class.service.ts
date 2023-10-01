import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PendingClassDto } from 'src/dtos/pending-class/pending-class.dto';
import {
  PendingClassList,
  PendingClassListDocument,
} from 'src/schemas/pending-class.schema';

@Injectable()
export class PendingClassService {
  constructor(
    @InjectModel(PendingClassList.name)
    private readonly pendingClassList: Model<PendingClassListDocument>,
    private configService: ConfigService,
  ) {}

  async registerToClass(data: PendingClassDto): Promise<PendingClassList> {
    try {
      const existRegisterd = await this.pendingClassList.findOne({
        student: data.studentId,
        class: data.classId,
        semester: this.configService.get('SEMESTER'),
        schoolYear: this.configService.get('SCHOOLYEAR'),
      });

      if (existRegisterd) {
        throw new HttpException('Sinh viên đã đăng ký vào nhóm này', 409);
      }

      return await this.pendingClassList.create({
        student: data.studentId,
        class: data.classId,
        status: false,
        type: data.type,
        topic: data.topic,
        description: data.description,
        semester: this.configService.get('SEMESTER'),
        schoolYear: this.configService.get('SCHOOLYEAR'),
      });
    } catch (error) {
      throw new HttpException('Đăng ký đề tài thất bại', 500);
    }
  }
}
