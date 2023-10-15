import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserUpdateDto } from 'src/dtos/user/user-update-dto';
import { RoleEnum } from 'src/enums/role-enum';
import { ClassDocument, Class } from 'src/schemas/class.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Class.name) private readonly classModel: Model<ClassDocument>,
    private configService: ConfigService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id, {password: false}).exec();
  }

  async findAllByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role: role }).populate('major').exec();
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

  async getByKey(role: RoleEnum, key: string, value: string): Promise<User[]> {
    const userData = await this.userModel
      .find({ role: role, [key]: value })
      .exec();
    if (!userData) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    return userData;
  }

  async findAllByMajor(role: RoleEnum, majorId: string): Promise<User[]> {
    try {
      return this.userModel.find({ major: majorId, role: role }).exec();
    } catch (error) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  //find teacher by major and has class has semester and schoolyear in env file
  async findAllTeacherHasClassByMajor(majorId: string): Promise<User[]> {
    try {
      const classData = await this.classModel
        .find({
          major: majorId,
          semester: this.configService.get('SEMESTER'),
          schoolYear: this.configService.get('SCHOOLYEAR'),
        })
        .exec();
      const teacherList = classData.map((item) => item.teacher);
      const teacherData = await this.userModel
        .find({ _id: { $in: teacherList }, role: RoleEnum.TEACHER })
        .exec();
      return teacherData;
    } catch (error) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
