import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/schemas/user.schema';
import { UserCreateDto } from 'src/dtos/user/user-create-dto';
import { UserUpdateDto } from 'src/dtos/user/user-update-dto';
import { ResponseData } from 'src/global/globalClass';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() newUser: UserCreateDto): ResponseData<Promise<User>> {
    return new ResponseData(
      this.userService.create(newUser),
      'User created',
      201,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string): ResponseData<Promise<User>> {
    return new ResponseData(
      this.userService.findOneById(id),
      'User found',
      200,
    );
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateUser: UserUpdateDto,
  ): ResponseData<Promise<User>> {
    return new ResponseData(
      this.userService.update(id, updateUser),
      'User updated',
      200,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string): ResponseData<Promise<User>> {
    return new ResponseData(this.userService.delete(id), 'User deleted', 200);
  }
}
