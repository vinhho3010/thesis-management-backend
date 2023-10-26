import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Result, ResultDocument } from 'src/schemas/result.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ThesisService {
  constructor(
    @InjectModel(Thesis.name)
    private readonly ThesisModel: Model<ThesisDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Result.name)
    private readonly ResultModel: Model<ResultDocument>,
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
      })
      .populate('results');
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
    
  async updateThesisCustomUrl(thesisId: string, thesisDto: any) {
    return await this.ThesisModel.findByIdAndUpdate(thesisId, thesisDto, { new: true});
  }

  async updateThesis(thesisId: string, thesisDto: any) {
    return await this.ThesisModel.findByIdAndUpdate(thesisId, thesisDto, { new: true});
  }

  async updateThesisScoring(thesisId: string, scoringDto: any) {
    const thesis = await this.ThesisModel.findById(thesisId);
    const result = await this.ResultModel.findOne({
      thesis: thesisId,
      teacher: scoringDto.teacher,
    });

    if(!result){
      const newResult = new this.ResultModel({
        thesis: thesisId,
        teacher: scoringDto.teacher,
        mark: scoringDto.mark,
      });
      await newResult.save();
      thesis.results.push(newResult._id);
      thesis.status = ThesisStatus.COMPLETED;
      await thesis.save();
      return newResult;
    } else {
      result.mark = scoringDto.mark;
      await result.save();
      return result;
    }
  }
}
