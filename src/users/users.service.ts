import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Prisma } from 'generated/prisma/client';
import { UserRole } from 'generated/prisma/enums';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: { page?: number; limit?: number; search?: string }) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' } },
            { fullName: { contains: query.search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async getProfile(userId: string) {
    return this.findOne(userId);
  }

  async updateSelf(userId: string, dto: UpdateUserDto) {
    // user o‘z ro‘lini o‘zgartira olmaydi
    if (dto.role) delete dto.role;

    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async updateByAdmin(
    adminRole: UserRole,
    targetUserId: string,
    dto: UpdateUserDto,
  ) {
    if (adminRole !== UserRole.ADMIN)
      throw new ForbiddenException('Only admin can update other users');

    await this.findOne(targetUserId);

    return this.prisma.user.update({
      where: { id: targetUserId },
      data: dto,
    });
  }

  async remove(adminRole: UserRole, id: string) {
    if (adminRole !== UserRole.ADMIN)
      throw new ForbiddenException('Only admin can delete users');

    await this.findOne(id);

    return this.prisma.user.delete({
      where: { id },
    });
  }
}
