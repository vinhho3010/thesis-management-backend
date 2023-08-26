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

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() newUser: UserCreateDto): Promise<User> {
    return this.userService.create(newUser);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<User> {
    return this.userService.findOneById(id);
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
}
