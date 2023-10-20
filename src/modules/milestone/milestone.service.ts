import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { milestoneCreateDto } from 'src/dtos/milestone/milestone-dto';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Milestone, MilestoneDocument } from 'src/schemas/milestone.schema';
import { MailSenderService } from '../mail-sender/mailsender.service';
import { MailSenderDto } from 'src/dtos/mail-sender/mail-sender';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    private readonly mailSenderService: MailSenderService,
    private configService: ConfigService,
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

  async getMilestone(milestoneId: string): Promise<Milestone> {
    const milestone = await this.milestoneModel
      .findById(milestoneId)
      .populate('class')
      .populate('thesisVersionList');
    if (!milestone) {
      throw new HttpException('Không tìm thấy', 404);
    }
    return milestone;
  }

  async createMilestone(classId: string, milestone: milestoneCreateDto): Promise<Milestone> {
    const savedMilestone = {
      title: milestone.title,
      description: milestone.description,
      startDate: milestone.startDate,
      endDate: milestone.endDate,
      class: classId,
    };
    const newMilestone = await this.milestoneModel.create(savedMilestone);
    const classInfo = await this.classModel.findById(classId)
    .populate('teacher', 'fullName email')
    .populate('student', 'fullName email');
    if(newMilestone && milestone?.isSendMail) {
      this.mailSenderService.informNewMilestone(this.buildCreateMilestoneContext(newMilestone, classInfo));
    }
    return newMilestone;
  }

  async updateMilestone(milestoneId: string, milestone: Milestone): Promise<Milestone> {
    return await this.milestoneModel.findByIdAndUpdate(milestoneId, milestone);
  }

  async deleteMilestone(milestoneId: string): Promise<Milestone> {
    return await this.milestoneModel.findByIdAndDelete(milestoneId);
  }

  buildCreateMilestoneContext (milestone: Milestone, classInfo: Class): MailSenderDto {
    return {
      to: classInfo.student.map(student => student.email),
      context: {
        title: milestone.title,
        teacher: classInfo.teacher.fullName,
        milestone: `${milestone.startDate.toLocaleDateString('en-GB')} - ${milestone.endDate.toLocaleDateString('en-GB')}`,
        url: `${this.configService.get('CLIENT_URL')}/milestones/detail/${milestone._id}`,
      }
    };
  }
}
