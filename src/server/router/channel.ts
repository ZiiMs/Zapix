import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const channelRouter = createRouter()
  .query('get', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const foundChannel = await ctx.prisma.channels
        .findFirstOrThrow({
          where: {
            id: input.id,
          },
        })
        .catch((e) => {
          throw new TRPCError({
            code: 'CLIENT_CLOSED_REQUEST',
            cause: e,
            message: e.message,
          });
        });

      return foundChannel;
    },
  })
  .query('messages.getInfinite', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().or(z.date()).nullish(),
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor, id } = input;
      const items = await ctx.prisma.messages.findMany({
        where: {
          channelsId: id,
        },
        take: limit + 1,
        cursor: cursor ? { createdAt: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        include: {
          User: true,
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.createdAt;
      }

      return { items, nextCursor };
    },
  });

