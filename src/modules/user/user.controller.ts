import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { UserUpdateDto } from 'src/dtos/user/user-update-dto';
import { RoleEnum } from 'src/enums/role-enum';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get('roles/:role')
  findAllByRole(@Param('role') role: string): Promise<User[]> {
    return this.userService.findAllByRole(role);
  }
  @Get('roles/:role/pagination')
  findAllByRoleWithPagination(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Param('role') role: string,
  ): Promise<User[]> {
    return this.userService.findAllByRoleWithPagination(page, limit, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
  }

  @Get('major/:majorId')
  findAllTeacherByMajor(
    @Query('role') role,
    @Param('majorId') majorId: string,
  ): Promise<User[]> {
    return this.userService.findAllByMajor(role, majorId);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUser: UserUpdateDto,
  ): Promise<User> {
    return this.userService.update(id, updateUser);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<User> {
    return this.userService.delete(id);
  }

  @Get('key-value/:role')
  getByKey(
    @Param('role') role: RoleEnum,
    @Query('key') key: string,
    @Query('value') value: string,
  ): Promise<User[]> {
    return this.userService.getByKey(role, key, value);
  }

  @Get('major/:majorId/has-class')
  findAllTeacherByMajorHasClass(
    @Param('majorId') majorId: string,
  ): Promise<User[]> {
    return this.userService.findAllTeacherHasClassByMajor(majorId);
  }
}
