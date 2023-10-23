/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
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
            select: 'name student',
            populate: {
                path: 'student',
                select: 'fullName email',
            },
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
        log(filters);
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
        return await this.CouncilModel.findByIdAndDelete(councilId);
    }
}
