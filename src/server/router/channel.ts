import { Messages, User } from '@prisma/client';
import * as trpc from '@trpc/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { ee } from '../events';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const channelRouter = createProtectedRouter()
  .subscription('onAdd', {
    input: z.object({
      channelId: z.string(),
    }),
    resolve({ ctx, input }) {
      return new trpc.Subscription<
        Messages & {
          User: User;
        }
      >((emit) => {
        const onAdd = (
          data: Messages & {
            User: User;
          }
        ) => {
          if (input.channelId === data.channelsId) {
            emit.data(data);
          }
        };

        ee.on('addMessage', onAdd);

        return () => {
          ee.off('addMessage', onAdd);
        };
      });
    },
  })
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
  })
  .mutation('create', {
    input: z.object({
      body: z.string(),
      channelId: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newMessage = await ctx.prisma.messages.create({
        data: {
          body: input.body,
          channelsId: input.channelId,
          userId: ctx.session.user.id,
        },
        include: {
          User: true,
        },
      });
      ee.emit('addMessage', { ...newMessage });
      return newMessage;
    },
  });

