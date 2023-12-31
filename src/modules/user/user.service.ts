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
    return (await this.userModel.findById(id, {password: false}))
    .populate('major');
  }

  async findAllByRole(role: string): Promise<User[]> {
    return this.userModel.find({ role: role }).populate('major').exec();
  }

  async findAllByRoleWithPagination(page: number, limit: number, role: string): Promise<any> {
    const userData = await this.userModel
      .find({ role: role })
      .populate('major')
      .skip(page * limit)
      .limit(limit)
      //.sort({ createdAt: -1 });
    const total = await this.userModel.countDocuments({ role: role });
    return {
      data: userData,
      length: total,
      page: page,
      limit: limit,
    };
  }

  async update(id: string, user: UserUpdateDto): Promise<User> {
    try {
      return (await this.userModel.findByIdAndUpdate(id, user, { new: true }));
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
        .populate({
          path: 'instructClass',
          match: {
            semester: this.configService.get('SEMESTER'),
            schoolYear: this.configService.get('SCHOOLYEAR'),
          }, //filter only class has semester and schoolyear in env file as current semester
          select: 'name',
        })
        .exec();
      return teacherData.filter((item) => item.instructClass.length > 0);
    } catch (error) {
      throw new HttpException(
        'Không tìm thấy người dùng',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async countEachAccountByRole(semester?: string, schoolYear?: string) {
    const query = {}
    if(semester) {
      query['semester'] = semester
    }
    if(schoolYear) {
      query['schoolYear'] = schoolYear
    }
    return {
      student: await this.userModel.countDocuments({ role: RoleEnum.STUDENT, ...query }),
      teacher: await this.userModel.countDocuments({ role: RoleEnum.TEACHER, ...query }),
      admin: await this.userModel.countDocuments({ role: RoleEnum.ADMIN, ...query }),
      ministry: await this.userModel.countDocuments({role: RoleEnum.MINISTRY, ...query})
    }
  }

  async countAccount(semester?: string, schoolYear?: string) {
    const query = {
      role: {$ne: RoleEnum.ADMIN}
    }
    if(semester) {
      query['semester'] = semester
    }
    if(schoolYear) {
      query['schoolYear'] = schoolYear
    }
    return await this.userModel.countDocuments({ ...query })
  }

  async searchUser(value: any, page: number, limit: number, role: string){
    let userData = [];
    let total = 0;
    if(value) {
      userData = await this.userModel
      .find({
        role: role,
        $or: [
          { fullName: { $regex: value, $options: 'i' } },
          { email: { $regex: value, $options: 'i' } },
          { code: { $regex: value, $options: 'i' } },
        ]
      })
      .populate('major')
      .skip(page * limit)
      .limit(limit)
      .exec();

    total = await this.userModel.countDocuments({
      role: role,
        $or: [
          { fullName: { $regex: value, $options: 'i' } },
          { email: { $regex: value, $options: 'i' } },
          { code: { $regex: value, $options: 'i' } },
        ]
    });
    }
    
    return {
      data: userData,
      length: total,
      page: page,
      limit: limit,
    };

  }
}
