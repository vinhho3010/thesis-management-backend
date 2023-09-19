import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Major, MajorDocument } from 'src/schemas/major.schema';

@Injectable()
export class MajorService {
  constructor(
    @InjectModel(Major.name) private readonly major: Model<MajorDocument>,
  ) {}

  getAll() {
    try {
      return this.major.find().exec();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
