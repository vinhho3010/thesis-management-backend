import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailSenderDto } from 'src/dtos/mail-sender/mail-sender';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';
import {
  ThesisVersion,
  ThesisVersionDocument,
} from 'src/schemas/thesis-version.schema';
import { MailSenderService } from '../mail-sender/mailsender.service';
import { RoleEnum } from 'src/enums/role-enum';

@Injectable()
export class ThesisVersionService {
  constructor(
    @InjectModel(ThesisVersion.name)
    private readonly thesisVersionModel: Model<ThesisVersionDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    private configService: ConfigService,
    private mailSenderService: MailSenderService,
  ) {}

  async getAllMilestoneVersion(milestoneId: string) {
    return await this.thesisVersionModel
      .find({ milestone: milestoneId })
      .exec();
  }

  async getSudentVersions(studentId: string) {
    return await this.thesisVersionModel
      .find({ student: studentId })
      .populate('milestone')
      .populate('comments')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getVersionStudentMilestone(studentId: string, milestoneId: string) {
    const version = await this.thesisVersionModel
      .findOne({ student: studentId, milestone: milestoneId })
      .populate('milestone')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'fullName email role avatar',
        },
        options: {
          sort: { createdAt: -1 } // Sort comments by createdAt field in ascending order.
        }
      })
      .exec();

    if (!version) {
      throw new HttpException('Không tìm thấy', 404);
    }
    return version;
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
        {
          url: newFile.url,
          updateUrlAt: new Date(),
          fileName: newFile.fileName,
        },
        { new: true },
      )
      .exec();
  }

  async addComment(thesisVersionId: string, commentDto: any) {
    const comment = await this.commentModel.create(commentDto);
    const thesisVersionWithNewComment = await this.thesisVersionModel
      .findByIdAndUpdate(
        thesisVersionId,
        {
          $push: {
            comments: comment,
          },
        },
        { new: true },
      ).populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'fullName email avatar',
        }
      });

      const withStudentInfo = await thesisVersionWithNewComment.populate('student', 'fullName email avatar');
      const withMilestone = await thesisVersionWithNewComment.populate('milestone', 'title');
      const newComment = await comment.populate('user', 'fullName email role avatar');

      if (withStudentInfo && withMilestone && newComment && newComment.user.role === RoleEnum.TEACHER && commentDto?.isSendMail) {
        this.mailSenderService.informNewCommentThesis(this.buildAddCommentContext(withMilestone, withStudentInfo, newComment));
      }
      
      return thesisVersionWithNewComment;
  }

  async deleteComment(thesisVersionId: string, commentId: string) {
   await this.commentModel.findByIdAndDelete(commentId).exec();
    return await this.thesisVersionModel
      .findByIdAndUpdate(
        thesisVersionId,
        {
          $pull: {
            comments: commentId,
          },
        },
        { new: true },
      )
      .exec();
  }


  buildAddCommentContext (withMilestone: any, withStudentInfo: any, newComment: any): MailSenderDto {
    return {
      to: withStudentInfo.student.email,
      context: {
        title: withMilestone.milestone.title,
        teacher: newComment.user.fullName,
        url: `${this.configService.get('CLIENT_URL')}/process/${withMilestone.milestone._id}`,
      }
    };
  }
}
