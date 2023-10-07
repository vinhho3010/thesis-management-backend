import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ClassPost, ClassPostDocument } from 'src/schemas/classPost.schema';

@Injectable()
export class ClassPostService {
  constructor(
    @InjectModel(ClassPost.name)
    private readonly postModel: Model<ClassPostDocument>,
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
      .sort({ createdAt: -1 });
  }
}
