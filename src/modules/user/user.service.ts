import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { log } from 'console';
import { Model } from 'mongoose';
import { UserUpdateDto } from 'src/dtos/user/user-update-dto';
import { RoleEnum } from 'src/enums/role-enum';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async findAllByRole(role: string): Promise<User[]> {
    return await this.userModel.find({ role: role }).exec();
  }

  async update(id: string, user: UserUpdateDto): Promise<User> {
    try {
      return this.userModel.findByIdAndUpdate(id, user);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async delete(id: string): Promise<User> {
    try {
      return this.userModel.findByIdAndDelete(id);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async findAllByMajor(role: RoleEnum, majorId: string): Promise<User[]> {
    try {
      log(role);
      return this.userModel.find({ major: majorId, role: role }).exec();
    } catch (error) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
