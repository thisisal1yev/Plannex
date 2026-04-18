import { Prisma } from '../generated/prisma/client';

/**
 * Расширение для soft delete модели User.
 *
 * Поведение:
 * - findUnique/findFirst/findMany/count — автоматически фильтрует удалённых
 * - delete/deleteMany — превращается в UPDATE { deletedAt: now() }
 *
 * Если нужно найти удалённых (админка, аналитика) — используй
 * обычный $queryRaw или временно игнорируй middleware через прямой клиент.
 */
export const softDeleteExtension = Prisma.defineExtension({
  name: 'softDelete',
  query: {
    user: {
      async findUnique({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findUniqueOrThrow({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirst({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findFirstOrThrow({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async findMany({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async count({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      async aggregate({ args, query }) {
        args.where = { ...args.where, deletedAt: null };
        return query(args);
      },
      // delete → update
      async delete({ args }) {
        return (this as any).user.update({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
      async deleteMany({ args }) {
        return (this as any).user.updateMany({
          where: args.where,
          data: { deletedAt: new Date() },
        });
      },
    },
  },
});