import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  listEventCategories() {
    return this.prisma.eventCategory.findMany({ orderBy: { name: 'asc' } });
  }

  listServiceCategories() {
    return this.prisma.serviceCategory.findMany({ orderBy: { name: 'asc' } });
  }
}
