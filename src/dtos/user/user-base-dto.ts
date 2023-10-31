import { RoleEnum } from 'src/enums/role-enum';

export class UserBaseDto {
  fullName: string;
  email: string;
  password: string;
  role: RoleEnum;
  gender: string;
  phoneNumber?: string;
  address?: string;
  code: string;
  avatar?: string;
  class?: string;
  major?: string;
}
