import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ThesisStatus } from 'src/enums/thesis-status.enum';
import { Council, CouncilDocument } from 'src/schemas/council.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class CouncilService {
  constructor(
    @InjectModel(Thesis.name)
    private readonly ThesisModel: Model<ThesisDocument>,
    @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
    @InjectModel(Council.name)
    private readonly CouncilModel: Model<CouncilDocument>,
    private configService: ConfigService,
  ) {}

  async createCouncil(councilDto: any) {
    return await this.CouncilModel.create(councilDto);
  }

  async getCouncil(councilId: string) {
    return await this.CouncilModel.findById(councilId)
      .populate('major')
      .populate({
        path: 'president',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'secretary',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'member',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'thesisList',
        select:
          'name student topic topicEng status protectInfo class url results',
        populate: [
          {
            path: 'student',
            select: 'fullName email code class major avatar',
            populate: { path: 'major' },
          },
          {
            path: 'class',
            select: 'teacher',
            populate: {
              path: 'teacher',
              select: 'fullName email avatar',
            },
          },
          {
            path: 'results',
          },
        ],
      });
  }

  async updateCouncil(councilId: string, councilDto: any) {
    return await this.CouncilModel.findByIdAndUpdate(councilId, councilDto, {
      new: true,
    });
  }

  async getCouncils(
    page: number,
    limit: number,
    majorId: string,
    schoolYear: string,
    semester: string,
  ) {
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
    const councils = await this.CouncilModel.find(filters)
      .populate({
        path: 'major',
        select: 'name',
      })
      .populate({
        path: 'president',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'secretary',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'member',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'thesisList',
        select: 'name',
      })
      .skip(page * limit)
      .limit(limit);

    const total = await this.CouncilModel.countDocuments(filters);

    return {
      data: councils,
      length: total,
      page: page,
      limit: limit,
    };
  }

  async deleteCouncil(councilId: string) {
    const council = await this.CouncilModel.findById(councilId);
    const thesisListId = council.thesisList.map((thesis: any) =>
      thesis._id.toString(),
    );
    await this.ThesisModel.updateMany(
      {
        _id: { $in: thesisListId },
      },
      {
        status: ThesisStatus.IN_PROGRESS,
        protectInfo: {},
      },
    );
    return await this.CouncilModel.findByIdAndDelete(councilId);
  }

  async addThesisToCouncil(
    councilId: string,
    thesisId: string,
    protectInfo: any,
  ) {
    const council = await this.CouncilModel.findById(councilId);
    //check if thesis is already in council
    const thesis = await this.ThesisModel.findById(thesisId);
    if (!thesis) {
      throw new HttpException('Không tìm thấy luận văn', 404);
    }
    const thesisListId = council.thesisList.map((thesis: any) =>
      thesis._id.toString(),
    );
    if (thesisListId.includes(thesisId)) {
      throw new HttpException('Luận văn đã có trong hội đồng', 409);
    } else {
      await this.ThesisModel.findByIdAndUpdate(thesisId, {
        protectInfo: protectInfo,
        status: ThesisStatus.ACCEPTED,
      });
      return await this.CouncilModel.findByIdAndUpdate(
        councilId,
        {
          $push: {
            thesisList: thesisId,
          },
        },
        { new: true },
      );
    }
  }

  async removeThesisFromCouncil(councilId: string, thesisId: string) {
    const council = await this.CouncilModel.findById(councilId);
    const thesisListId = council.thesisList.map((thesis: any) =>
      thesis._id.toString(),
    );
    if (!thesisListId.includes(thesisId)) {
      throw new HttpException('Luận văn không có trong hội đồng', 404);
    } else {
      await this.ThesisModel.findByIdAndUpdate(thesisId, {
        protectInfo: {},
        status: ThesisStatus.IN_PROGRESS,
      });
      return await this.CouncilModel.findByIdAndUpdate(
        councilId,
        {
          $pull: {
            thesisList: thesisId,
          },
        },
        { new: true },
      );
    }
  }

  async getCouncilByMemberId(id: string, schoolYear: string, semester: string) {
    const filters: any = {};
    if (semester) {
      filters.semester = semester as string;
    }
    if (schoolYear) {
      filters.schoolYear = schoolYear as string;
    }

    const councils = await this.CouncilModel.find({
      $or: [{ president: id }, { secretary: id }, { member: id }],
      ...filters,
    })
      .populate({
        path: 'major',
        select: 'name',
      })
      .populate({
        path: 'president',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'secretary',
        select: 'fullName email avatar',
      })
      .populate({
        path: 'member',
        select: 'fullName email avatar',
      });
    if (!councils) {
      throw new HttpException('Không tìm thấy hội đồng', 404);
    }
    return councils;
  }
}
