import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dtos/auth/login-dto';
import { ResponseData } from 'src/global/globalClass';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.userModel.findOne({ email: loginDto.email });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    if (user.password !== loginDto.password) {
      throw new HttpException('Invalid credentials', 401);
    }
    return new ResponseData(user, 'Login successful', 200);
  }

  async logout() {
    return 'Logout';
  }

  async register(registerDto: any) {
    const user = await this.userModel.findOne({ email: registerDto.email });
    if (user) {
      throw new HttpException('User already exists', 409);
    }
    try {
      const newUser = new this.userModel(registerDto);
      return newUser.save();
    } catch (error) {
      throw new HttpException(error, 409);
    }
  }
}
