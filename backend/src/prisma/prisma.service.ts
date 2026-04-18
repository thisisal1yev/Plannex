import { Global, Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../../generated/prisma/client';
import { softDeleteExtension } from '../../prisma/prisma.extension';

// Type helper — never called, used only to infer the extended client type.
const _buildExtended = (c: PrismaClient) => c.$extends(softDeleteExtension);
type ExtendedPrismaClient = ReturnType<typeof _buildExtended>;

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  // Filtered client: auto-excludes soft-deleted rows for supported models.
  // Use this.prisma.extended.user.* for normal queries.
  // Use this.prisma.user.* only when you explicitly need deleted rows (admin).
  readonly extended!: ExtendedPrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL!,
    });
    super({ adapter });
    (this as any).extended = this.$extends(softDeleteExtension);
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}