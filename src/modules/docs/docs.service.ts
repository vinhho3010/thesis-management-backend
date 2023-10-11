import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RefDocsDocument, refDocs } from 'src/schemas/refDocs.schema';
import { refDocsType, refDocsTypeDocument } from 'src/schemas/refDocType.schema';

@Injectable()
export class DocsService {
  constructor(
    @InjectModel(refDocs.name) private refDocsModel: Model<RefDocsDocument>,
    @InjectModel(refDocsType.name) private refDocsTypeModel: Model<refDocsTypeDocument>,
  ) {}

  async getDocsOfClass(id: string) {
    try {
      return await this.refDocsModel
        .find({ class: id })
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDocs(createDocsDto: refDocs) {
    try {
      const newDocs = await this.refDocsModel.create(createDocsDto);
      await this.refDocsTypeModel.findOneAndUpdate(newDocs.type, {
        $push: { refDocs: newDocs._id },
      });
      return newDocs;
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

  async GetType(id: string) {
    try {
      return this.refDocsTypeModel.findById(id);
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDocsOfType(id: string) {
    try {
      return await this.refDocsModel
        .find({ type: id })
        .populate('type', 'name')
        .sort({ createdAt: -1 });
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createDocsType(createDocsTypeDto: any) {
    try {
      const newDocsType = new this.refDocsTypeModel(createDocsTypeDto);
      return await newDocsType.save();
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDocsTypeInClass(classId: string) {
    try {
      const docsType = await this.refDocsTypeModel
        .find({ class: classId })
        .sort({ createdAt: -1 });
      return docsType;
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDocsType(id: string, updateDocsTypeDto: any) {
    try {
      const docsType = await this.refDocsTypeModel.findById(id);
      if (!docsType) {
        throw new HttpException('Không tìm thấy loại tài liệu', 404);
      }
      return await this.refDocsTypeModel.findByIdAndUpdate(id, updateDocsTypeDto);
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDocsType(id: string) {
    try {
      await this.refDocsModel.deleteMany({ type: id });
      return await this.refDocsTypeModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException('Lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
