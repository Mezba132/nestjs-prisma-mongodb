import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async createUser(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }

  @Get('all')
  async findAllUser() {
    return await this.usersService.findAllUser();
  }

  @Get(':id')
  async findOneUser(@Param('id') id: string) {
    return this.usersService.findOneUser(id);
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.updateUser(id, body);
  }

  @Delete('delete/:id')
  async removeUser(@Param('id') id: string) {
    return await this.usersService.removeUser(id);
  }
}
