import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { ClassPost, ClassPostDocument } from 'src/schemas/classPost.schema';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';

@Injectable()
export class ClassPostService {
  constructor(
    @InjectModel(ClassPost.name)
    private readonly postModel: Model<ClassPostDocument>,
    @InjectModel(Comment.name)
    private readonly commentModel: Model<CommentDocument>,
  ) {}

  //crud for post
  //create post
  async createPost(data: any): Promise<ClassPost> {
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
}
