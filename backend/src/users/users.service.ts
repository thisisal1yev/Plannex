import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns paginated list of all users (admin only)
   */
  async findMany(query: QueryUsersDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    const skip = (page - 1) * limit;

    const where = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: 'insensitive' as const } },
            {
              firstName: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
            {
              lastName: {
                contains: query.search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          firstName: true,
          lastName: true,
          role: true,
          avatarUrl: true,
          isVerified: true,
          createdAt: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: items,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  /**
   * Returns a single user by ID
   */
  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  /**
   * Updates the current user's own profile
   * If activeRole is provided, validates it is in the user's roles array
   */
  async updateSelf(userId: string, dto: UpdateUserDto) {
    await this.findOne(userId);

    const { activeRole, firstName, lastName, phone } = dto;
    const data: Record<string, unknown> = {};
    if (firstName !== undefined) data.firstName = firstName;
    if (lastName  !== undefined) data.lastName  = lastName;
    if (phone     !== undefined) data.phone      = phone;
    if (activeRole !== undefined) data.role      = activeRole;

    return this.prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        email: true,
        phone: true,
        firstName: true,
        lastName: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Deletes a user — admin only
   */
  async remove(adminRole: string, id: string) {
    if (adminRole !== 'ADMIN')
      throw new ForbiddenException('Only admins can delete users');

    await this.findOne(id);

    return this.prisma.user.delete({ where: { id } });
  }
}
