import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Major, MajorDocument } from 'src/schemas/major.schema';
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
    @InjectModel(Major.name)
    private readonly MajorModel: Model<MajorDocument>,
  ) {}

  async getStudentThesis(_id: string) {
    const student = await this.UserModel.findById(_id, { password: false });
    if (student) {
      const studentThesis = await this.ThesisModel.findOne({
        student: student._id,
        // semester: this.configService.get('SEMESTER'),
        // schoolYear: this.configService.get('SCHOOLYEAR'),
      })
        .populate({
          path: 'class',
          select: 'name',
          populate: {
            path: 'teacher',
            select: 'fullName email major avatar',
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
    return await this.ThesisModel.findOneAndUpdate(
      {
        student: studentId,
        // semester: this.configService.get('SEMESTER'),
        // schoolYear: this.configService.get('SCHOOLYEAR'),
      },
      thesisDto,
      { new: true },
    );
  }

  async updateThesisCustomUrl(thesisId: string, thesisDto: any) {
    return await this.ThesisModel.findByIdAndUpdate(thesisId, thesisDto, {
      new: true,
    });
  }

  async updateThesis(thesisId: string, thesisDto: any) {
    return await this.ThesisModel.findByIdAndUpdate(thesisId, thesisDto, {
      new: true,
    });
  }

  async updateThesisScoring(thesisId: string, scoringDto: any) {
    const thesis = await this.ThesisModel.findById(thesisId);
    const result = await this.ResultModel.findOne({
      $and: [{ thesis: thesisId }, { teacher: scoringDto.teacher }],
    });

    if (!result) {
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

  async getAllThesis(
    page: number,
    limit: number,
    semester: string,
    schoolYear: string,
    majorId: string,
    isPublic: string,
    status: ThesisStatus,
  ) {
    const skip = page * limit;
    const query = {};
    if (status) {
      query['status'] = status;
    }
    if (semester) {
      query['semester'] = semester;
    }
    if (schoolYear) {
      query['schoolYear'] = schoolYear;
    }
    if (majorId) {
      // await this.UserModel.find({major: majorId});
      //add filter  to find student has specfic major
      query['student'] = { $in: await this.UserModel.find({ major: majorId }) };
    }
    if (isPublic) {
      query['isPublic'] = isPublic;
    } else {
      query['isPublic'] = { $ne: true };
    }

    const thesis = await this.ThesisModel.find(query)
      .populate({
        path: 'class',
        select: 'name',
        populate: {
          path: 'teacher',
          select: 'fullName email major avatar code',
        },
      })
      .populate({
        path: 'student',
        select: 'fullName major email code avatar',
        populate: {
          path: 'major',
          select: 'name',
        },
      })
      .populate('results')
      .skip(skip)
      .limit(limit);
    const total = await this.ThesisModel.countDocuments(query);
    return {
      data: thesis,
      length: total,
      page: page,
      limit: limit,
    };
  }

  async countThesis(semester?: string, schoolYear?: string) {
    const query = {};
    if (semester) {
      query['semester'] = semester;
    }
    if (schoolYear) {
      query['schoolYear'] = schoolYear;
    }
    return await this.ThesisModel.countDocuments(query);
  }

  async countAllThesisByMajor(semester?: string, schoolYear?: string) {
    try {
      const major = await this.MajorModel.find().sort({ name: 1 });
      const result = [];

      for (const item of major) {
        const count = await this.countThesisByMajor(
          item._id,
          semester,
          schoolYear,
        );
        result.push({
          major: item.name,
          count: count,
        });
      }

      return result;
    } catch (error) {
      throw new HttpException('Không tìm thấy ngành', 404);
    }
  }

  async countThesisByMajor(
    majorId?: any,
    semester?: string,
    schoolYear?: string,
  ) {
    const query = {};
    if (semester) {
      query['semester'] = semester;
    }
    if (schoolYear) {
      query['schoolYear'] = schoolYear;
    }

    if (majorId) {
      //count student has match major in thesis
      const student = await this.UserModel.find({ major: majorId });
      query['student'] = { $in: student };
    }
    return await this.ThesisModel.countDocuments(query);
  }
  async countThesisBySchoolyear(schoolYear: string) {
    try {
      const schoolYearArr = schoolYear.split(',');
      const query = {};
      const result = [];
      for (const item of schoolYearArr) {
        query['schoolYear'] = item;
        const count = await this.ThesisModel.countDocuments(query);
        result.push({
          schoolYear: item,
          count: count,
        });
      }
      return result;
    } catch (error) {
      throw new HttpException('Không tìm thấy năm học', 404);
    }
  }
}
