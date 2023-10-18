import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Milestone, MilestoneDocument } from 'src/schemas/milestone.schema';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
  ) {}

  async getAllClassMilestone(classId: string): Promise<Milestone[]> {
    const milestones = await this.milestoneModel
      .find({ class: classId })
      .populate('class')
      .populate('thesisVersionList');
    if (!milestones) {
      throw new HttpException('Không tìm thấy', 404);
    }
    return milestones;
  }

  async createMilestone(classId: string, milestone: Milestone): Promise<Milestone> {
    const savedMilestone = {
      title: milestone.title,
      description: milestone.description,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      class: classId,
    };
    const newMilestone = await this.milestoneModel.create(savedMilestone);
    return newMilestone;
  }

  async updateMilestone(
    milestoneId: string,
    milestone: Milestone,
  ): Promise<Milestone> {
    return await this.milestoneModel.findByIdAndUpdate(milestoneId, milestone);
  }

  async deleteMilestone(milestoneId: string): Promise<Milestone> {
    return await this.milestoneModel.findByIdAndDelete(milestoneId);
  }
}
