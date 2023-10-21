/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ThesisVersion,
  ThesisVersionDocument,
} from 'src/schemas/thesis-version.schema';

@Injectable()
export class ThesisVersionService {
  constructor(
    @InjectModel(ThesisVersion.name)
    private readonly thesisVersionModel: Model<ThesisVersionDocument>,
  ) {}

  async getAllMilestoneVersion(milestoneId: string) {
    return await this.thesisVersionModel
      .find({ milestone: milestoneId })
      .exec();
  }

  async getVersionStudentMilestone(studentId: string, milestoneId: string) {
    return await this.thesisVersionModel
      .findOne({ student: studentId, milestone: milestoneId })
      .populate('milestone')
      .exec();
  }

  async updateThesisVersion(thesisVersionId: string, thesisVersionDto: any) {
    return await this.thesisVersionModel
      .findByIdAndUpdate(thesisVersionId, thesisVersionDto, { new: true })
      .exec();
  }

  async updateThesisVersionUrl(thesisVersionId: string, newFile: any) {
    return await this.thesisVersionModel
      .findByIdAndUpdate(
        thesisVersionId,
        { url: newFile.url, updateUrlAt: new Date(), fileName: newFile.fileName },
        { new: true },
      )
      .exec();
  }
}
