/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/schemas/comment.schema';

@Injectable()
export class CommentService {
    constructor(@InjectModel(Comment.name) private readonly CommentModel: Model<CommentDocument>) {}

    async createComment(belongsTo: string, userId: string, content: string) {
        const newComment = new this.CommentModel({
            userId,
            content,
            belongsTo,
        });
        return await newComment.save();
    }

    async getComment(belongsTo: string) {
        return await this.CommentModel.find({ belongsTo }).populate('userId', 'fullName');
    }

    async deleteComment(_id: string) {
        return await this.CommentModel.findByIdAndDelete(_id);
    }

    async updateComment(_id: string, commentDto: any) {
        const { content } = commentDto;
        return await this.CommentModel.findByIdAndUpdate(_id, { content }, { new: true});
    }
}
