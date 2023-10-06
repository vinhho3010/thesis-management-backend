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

  async getPostByClass(classId: string): Promise<ClassPost[]> {
    return await this.postModel
      .find({ class: classId })
      .sort({ createdAt: -1 });
  }
}
