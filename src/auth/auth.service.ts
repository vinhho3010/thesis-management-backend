import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoginDto } from 'src/dtos/auth/login-dto';
import { ResponseData } from 'src/global/globalClass';
import { User, UserDocument } from 'src/schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from 'src/dtos/auth/register-dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ email: email });
    if (!user) {
      throw new UnauthorizedException('Account not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return new ResponseData(
      {
        user,
        token,
      },
      'Login successful',
      200,
    );
  }

  async logout() {
    return 'Logout';
  }

  async register(registerDto: RegisterDto) {
    const { password } = registerDto;
    const user = await this.userModel.findOne({ email: registerDto.email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await this.userModel.create({
        ...registerDto,
        password: hashedPassword,
      });

      const token = this.jwtService.sign({
        id: newUser._id,
        email: newUser.email,
        role: newUser.role,
      });
      return new ResponseData({ newUser, token }, 'User created', 201);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
