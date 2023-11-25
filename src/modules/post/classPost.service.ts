import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { Class, ClassDocument } from 'src/schemas/class.schema';
import { ClassPost, ClassPostDocument } from 'src/schemas/classPost.schema';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';
import { MailSenderService } from '../mail-sender/mailsender.service';
import { MailSenderDto } from 'src/dtos/mail-sender/mail-sender';
import { User } from 'src/schemas/user.schema';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClassPostService {
  constructor(
    @InjectModel(ClassPost.name)
    private readonly postModel: Model<ClassPostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
    @InjectModel(Class.name)
    private readonly classModel: Model<ClassDocument>,
    private readonly mailSenderService: MailSenderService,
    private readonly configService: ConfigService
  ) {}

  //crud for post
  //create post
  async createPost(data: any): Promise<ClassPost> {
    
    const classData = await this.classModel.findById(data.class).populate('student teacher');
    if(classData.student) {
      this.mailSenderService.informNewPost(
        this.buildMailSenderContext(classData.student, classData.teacher)
      )
    }
    return await this.postModel.create(data);

  }

  async updatePost(id: string, data: any): Promise<ClassPost> {
    return await this.postModel.findOneAndUpdate({ _id: id }, data, {
      new: true,
    });
  }

  async deletePost(id: string): Promise<ClassPost> {
    return this.postModel.findOneAndDelete({ _id: id });
  }

  async getPostByClass(classId: string): Promise<ClassPost[]> {
    return await this.postModel
      .find({ class: classId })
      .populate('user')
      .populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'fullName email avatar',
        }
      })
      .sort({ createdAt: -1 });
  }

  async addComment(id: string, commentDto: any): Promise<ClassPost> {
    const newComment = await this.commentModel.create(commentDto);
    log(newComment);

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        { $push: { comments: newComment } },
        { new: true },
      ).populate({
        path: 'comments',
        populate: {
          path: 'user',
          select: 'fullName email avatar',
        }
      });
    return updatedPost;
  }

  async deleteComment(id: string, commentId: string): Promise<ClassPost> {
    await this.commentModel.findByIdAndDelete(commentId).exec();
    return await this.postModel.findByIdAndUpdate(
      id,
      {
        $pull: { comments: commentId },
      },
      { new: true },
    );
  }

  buildMailSenderContext(studentList: User[], teacher: User) : MailSenderDto {
    return {
      to: studentList.map(student => student.email),
      context: {
        teacher: teacher.fullName,
        url: `${this.configService.get('CLIENT_URL')}/class`
      }

    }
  }
}
