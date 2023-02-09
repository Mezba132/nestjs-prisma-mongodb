import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';
const bcrypt = require('bcryptjs');
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    try {
      const salt = bcrypt.genSaltSync(10);
      createUserDto.password = bcrypt.hashSync(createUserDto.password, salt);
      const existUser = await this.prisma.user.findUnique({
        where: { email: createUserDto.email },
      });
      if (!existUser) {
        const newUser = await this.prisma.user.create({
          data: createUserDto,
        });
        return {
          success: true,
          message: 'New user registered successfully',
          data: newUser,
        };
      } else {
        return {
          success: false,
          message: 'user already exist.',
        };
      }
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          code: error.code,
          message: error.message,
        };
      }
    }
  }

  async findAllUser() {
    try {
      const users = await this.prisma.user.findMany({
        skip: 0,
        take: 5,
        orderBy: {
          id: 'desc',
        },
      });
      return {
        success: true,
        message: 'All Users fetch successfully.',
        data: users,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async findOneUser(id: string) {
    try {
      const findUser = await this.prisma.user.findFirst({ where: { id } });
      return {
        success: true,
        message: `${findUser.name} Info fetch successfully.`,
        data: findUser,
      };
    } catch (error) {
      return {
        message : error
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return {
          code: error.code,
          message: error.shortMessage,
        };
      }
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateUser = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      return {
        success: true,
        message: 'Update data successfully.',
        data: updateUser,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async removeUser(id: string) {
    try {
      const deleteUser = await this.prisma.user.delete({ where: { id } });
      return {
        sussces: true,
        message: 'deleted data successfully.',
        data: deleteUser,
      };
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
