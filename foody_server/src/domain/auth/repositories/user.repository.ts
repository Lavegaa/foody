import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/services/prisma/prisma.service';
import { CreateUserDto } from '../models/user.dto';

@Injectable()
export default class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(userInfo: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        profileImage: userInfo.profileImage,
        lastLoginAt: new Date(),
      },
    });
  }

  async updateLastLogin(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    });
  }
}
