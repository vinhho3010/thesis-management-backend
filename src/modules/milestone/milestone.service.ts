import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { milestoneCreateDto } from 'src/dtos/milestone/milestone-dto';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { Milestone, MilestoneDocument } from 'src/schemas/milestone.schema';
import { MailSenderService } from '../mail-sender/mailsender.service';
import { MailSenderDto } from 'src/dtos/mail-sender/mail-sender';
import { ConfigService } from '@nestjs/config';
import { ThesisVersion, ThesisVersionDocument } from 'src/schemas/thesis-version.schema';
import { Thesis, ThesisDocument } from 'src/schemas/thesis.schema';

@Injectable()
export class MilestoneService {
  constructor(
    @InjectModel(Milestone.name)
    private readonly milestoneModel: Model<MilestoneDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    @InjectModel(ThesisVersion.name) private readonly thesisVersionModel: Model<ThesisVersionDocument>,
    @InjectModel(Thesis.name) private readonly thesisModel: Model<ThesisDocument>,
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
      .populate({
        path: 'thesisVersionList',
        populate: {
          path: 'student',
          select: 'fullName email',
        }
      })
      .sort({ createdAt: -1 });
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

    if(newMilestone) { //create success
      for(const student of classInfo.student) {
        const thesis = await this.thesisModel.findOne({student: student._id})
        const newVersion = await this.thesisVersionModel.create({
          student: student._id,
          milestone: newMilestone._id,
          class: classId,
          semester: classInfo.semester,
          schoolYear: classInfo.schoolYear,
          thesis: thesis._id,
        });
        //push created thesis version to thesis
        thesis.versions.push(newVersion);
        await thesis.save();

        newMilestone.thesisVersionList.push(newVersion);
        await newMilestone.save();
      }


      if(milestone?.isSendMail) { //need to send mail
        this.mailSenderService.informNewMilestone(this.buildMilestoneContext(newMilestone, classInfo));
      }
    }
    return newMilestone;
  }

  async updateMilestone(milestoneId: string, milestone: any): Promise<Milestone> {
    const updatedMilestone = await this.milestoneModel.findByIdAndUpdate(milestoneId, milestone, { new: true });
    if(updatedMilestone && milestone?.isSendMail) {
      const classInfo = await this.classModel.findById(updatedMilestone.class)
      .populate('teacher', 'fullName email')
      .populate('student', 'fullName email');
      this.mailSenderService.informUpdatedMilestone(this.buildMilestoneContext(updatedMilestone, classInfo));
    }
    return updatedMilestone
  }

  async deleteMilestone(milestoneId: string): Promise<Milestone> {
    this.thesisVersionModel.deleteMany({ milestone: milestoneId });
    return await this.milestoneModel.findByIdAndDelete(milestoneId);
  }

  buildMilestoneContext (milestone: Milestone, classInfo: Class): MailSenderDto {
    return {
      to: classInfo.student.map(student => student.email),
      context: {
        title: milestone.title,
        teacher: classInfo.teacher.fullName,
        milestone: `${milestone.startDate.toLocaleDateString('en-GB')} - ${milestone.endDate.toLocaleDateString('en-GB')}`,
        url: `${this.configService.get('CLIENT_URL')}/process/${milestone._id}`,
      }
    };
  }
}
