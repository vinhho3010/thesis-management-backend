import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { RoleEnum } from 'src/enums/role-enum';

export class RegisterDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;

  @IsNotEmpty()
  fullName: string;

  gender: string;

  role: RoleEnum;

  phone?: string;

  address?: string;

  code: string;

  avatar?: string | 'default.png';

  class?: string;

  major?: string;
}
