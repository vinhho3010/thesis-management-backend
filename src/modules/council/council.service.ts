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
        @InjectModel(Thesis.name) private readonly ThesisModel: Model<ThesisDocument>,
        @InjectModel(User.name) private readonly UserModel: Model<UserDocument>,
        @InjectModel(Council.name) private readonly CouncilModel: Model<CouncilDocument>,
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
            select: 'fullName email',
          })
          .populate({
            path: 'secretary',
            select: 'fullName email',
          })
          .populate({
            path: 'member',
            select: 'fullName email',
          })
          .populate({
            path: 'thesisList',
            select: 'name student topic topicEng status protectInfo class',
            populate: [
              { path: 'student', select: 'fullName email code class major' },
              {
                path: 'class',
                select: 'teacher',
                populate: {
                  path: 'teacher',
                  select: 'fullName email',
                },
              },
            ],
          });
    }

    async updateCouncil(councilId: string, councilDto: any) {
        return await this.CouncilModel.findByIdAndUpdate(councilId, councilDto, { new: true});
    }

    async getCouncils(majorId?: string, schoolYear?: string, semester?: string) {
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
        return await this.CouncilModel.find(filters)
            .populate({
                path: 'major',
                select: 'name',
            })
            .populate({
                path: 'president',
                select: 'fullName email',
            })
            .populate({
                path: 'secretary',
                select: 'fullName email',
            })
            .populate({
                path: 'member',
                select: 'fullName email',
            })
            .populate({
                path: 'thesisList',
                select: 'name',
            });
    }

    async deleteCouncil(councilId: string) {
        const council = await this.CouncilModel.findById(councilId);
        const thesisListId = council.thesisList.map((thesis: any) => thesis._id.toString());
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

    async addThesisToCouncil(councilId: string, thesisId: string, protectInfo: any) {
        const council = await this.CouncilModel.findById(councilId);
        //check if thesis is already in council
        const thesis = await this.ThesisModel.findById(thesisId);
        if (!thesis) {
            throw new HttpException('Không tìm thấy luận văn', 404);
        }
        const thesisListId = council.thesisList.map((thesis: any) => thesis._id.toString());
        if (thesisListId.includes(thesisId)) {
            throw new HttpException('Luận văn đã có trong hội đồng', 409);
        } else {
            await this.ThesisModel.findByIdAndUpdate(thesisId, {
                protectInfo: protectInfo,
                status: ThesisStatus.ACCEPTED,
            });
            return await this.CouncilModel.findByIdAndUpdate(councilId, {
                $push: {
                    thesisList: thesisId,
                },
            }, { new: true});
        }
    }

    async removeThesisFromCouncil(councilId: string, thesisId: string) {
        const council = await this.CouncilModel.findById(councilId);
        const thesisListId = council.thesisList.map((thesis: any) => thesis._id.toString());
        if (!thesisListId.includes(thesisId)) {
            throw new HttpException('Luận văn không có trong hội đồng', 404);
        } else {
            await this.ThesisModel.findByIdAndUpdate(thesisId, {
                protectInfo: {},
                status: ThesisStatus.IN_PROGRESS,
            });
            return await this.CouncilModel.findByIdAndUpdate(councilId, {
                $pull: {
                    thesisList: thesisId,
                },
            }, { new: true});
        }
    }
}