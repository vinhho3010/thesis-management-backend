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
import { RoleEnum } from 'src/enums/role-enum';
import { ConfigService } from '@nestjs/config';
import { ChangePasswordDto } from 'src/dtos/auth/change-password';
import { MailSenderService } from '../mail-sender/mailsender.service';
import { log } from 'console';


@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailSenderService: MailSenderService
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel
      .findOne({ email: email })
      .populate('major')
      .populate('instructClass');

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Sai mật khẩu');
    }

    if(user.role === RoleEnum.STUDENT) {
     const withCurrentClass = await user.populate('followClass');
     if(withCurrentClass.followClass.schoolYear !== this.configService.get('SCHOOLYEAR') || withCurrentClass.followClass.semester !== this.configService.get('SEMESTER')) {
      user.followClass = null;
    } else {
      user.followClass = withCurrentClass.followClass._id;
    }
  }

    const token = this.jwtService.sign({
      user,
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
    const { password, email, code } = registerDto;
    const user = await this.userModel.findOne({
      $or: [{ email: email }, { code: code }],
    });
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

  async registerListAccount(listRegister: RegisterDto[]) {
    try {
      if (listRegister.length === 0) {
        throw new HttpException(
          'Danh sách tài khoản rỗng',
          HttpStatus.BAD_REQUEST,
        );
      }
      const duplicatedAccount = [];
      const newAccount = [];
      const standarlizedListRegister = listRegister.map((register) => {
        return {
          ...register,
          password: bcrypt.hashSync(register.password, 10),
        };
      });

      for await (const register of standarlizedListRegister) {
        const duplicatedUser = await this.userModel.findOne({
          $or: [{ email: register.email }, { code: register.code }],
        });
        if (duplicatedUser) {
          duplicatedAccount.push(register);
        } else {
          newAccount.push(register);
        }
      }

      if (newAccount.length === 0) {
        throw new HttpException(
          'Tất cả email đăng ký đã tồn tại',
          HttpStatus.CONFLICT,
        );
      } else {
        await this.userModel.insertMany(newAccount);
      }

      return new ResponseData(
        { duplicatedAccount, newAccount },
        'Đăng ký thành công danh sách tài khoản',
        201,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const { _id, oldPassword, newPassword } = changePasswordDto;
    try {
      const user = await this.userModel.findById(_id);
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new HttpException('Sai mật khẩu', HttpStatus.BAD_REQUEST);
      }
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userModel.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });
      return new ResponseData(
        null,
        'Đổi mật khẩu thành công',
        HttpStatus.OK,
      );
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async forceChangePassword(_id: string) {
    const randomPass = this.randomPassGenerate(8);
    const hashedPassword = await bcrypt.hash(randomPass, 10);
    log(`reset Password to: ${randomPass}`);
    const updatedUser =  await this.userModel.findByIdAndUpdate(_id, {
      password: hashedPassword,
    }, {new: true});

    this.mailSenderService.informPasswordReset({
      to: updatedUser.email,
      context: {
        password: randomPass,
      },
    });

    return new ResponseData(
      null,
      'Đổi mật khẩu thành công',
      HttpStatus.OK,
    );
  }

  private randomPassGenerate(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}
}
