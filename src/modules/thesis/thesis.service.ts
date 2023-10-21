import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ThesisService {
  constructor(
    @InjectModel(Thesis.name)
    private readonly ThesisModel: Model<ThesisDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    private configService: ConfigService,
  ) {}

  async getStudentThesis(_id: string) {
    const student = await this.UserModel.findById(_id, {password: false});
    if (student) {
      const studentThesis = await this.ThesisModel.findOne({
        student: student._id,
        semester: this.configService.get('SEMESTER'),
        schoolYear: this.configService.get('SCHOOLYEAR'),
      })
      .populate({
        path: 'class',
        select: 'name',
        populate: {
          path: 'teacher',
          select: 'fullName email major',
        },
      })
      .populate('student', 'fullName')
      .populate({
        path: 'versions',
        populate: {
          path: 'milestone',
          select: 'title',
        },
      });
      return studentThesis;
    } else {
      throw new HttpException('Không tìm thấy sinh viên', HttpStatus.NOT_FOUND);
    }
  }

  async updateStudentThesis(studentId: string, thesisDto: any) {
    return await this.ThesisModel.findOneAndUpdate({
      student: studentId,
      semester: this.configService.get('SEMESTER'),
      schoolYear: this.configService.get('SCHOOLYEAR'),
    }, thesisDto, { new: true});
  }

}
