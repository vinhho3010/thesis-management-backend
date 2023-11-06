import { Body, Controller, Post, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from 'src/dtos/auth/login-dto';
import { RegisterDto } from 'src/dtos/auth/register-dto';
import { ChangePasswordDto } from 'src/dtos/auth/change-password';

@Controller('/api')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('register-list')
  async registerList(@Body() listRegister: RegisterDto[]) {
    return this.authService.registerListAccount(listRegister);
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(changePasswordDto);
  }

  @Put('force-change-password')
  async forgotPassword(@Body() body: any) {
    return this.authService.forceChangePassword(body._id);
  }
}
