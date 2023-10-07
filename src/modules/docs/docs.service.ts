import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefDocsDocument, refDocs } from 'src/schemas/refDocs.schema';

@Injectable()
export class DocsService {
  constructor(
    @InjectModel(refDocs.name) private refDocsModel: Model<RefDocsDocument>,
  ) {}

  async getDocsOfClass(id: string) {
    try {
      return await this.refDocsModel.find({ class: id });
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDocs(createDocsDto: refDocs) {
    try {
      const newDocs = new this.refDocsModel(createDocsDto);
      return await newDocs.save();
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDocs(id: string) {
    try {
      return await this.refDocsModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
