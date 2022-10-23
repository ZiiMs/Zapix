import { DirectMessages, User } from '@prisma/client';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import { ee } from '../events';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const MessagesRouter = createProtectedRouter()
  .subscription('onAdd', {
    input: z.object({
      channelId: z.string(),
    }),
    resolve({ ctx, input }) {
      return new trpc.Subscription<
        DirectMessages & {
          Sender: User;
        }
      >((emit) => {
        const onAdd = (data: {
          dm: DirectMessages & {
            Sender: User;
          };
          channelId: string;
        }) => {
          if (input.channelId === data.channelId) {
            emit.data(data.dm);
          }
        };

        ee.on('addDm', onAdd);

        return () => {
          ee.off('addDm', onAdd);
        };
      });
    },
  })
  .query('infiniteDms', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.string().or(z.date()).nullish(),
      friendId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor, friendId } = input;
      const items = await ctx.prisma.directMessages.findMany({
        where: {
          Reciever: {
            id: friendId,
          },
        },
        take: limit + 1,
        cursor: cursor ? { createdAt: cursor } : undefined,
        orderBy: {
          createdAt: 'desc',
        },
        skip: 0,
        include: {
          Sender: true,
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
      text: z.string(),
      reciever: z.string(),
      channelId: z.string(),
    }),
    async resolve({ ctx, input }) {
      if (input.reciever === '') {
        throw new trpc.TRPCError({
          code: 'NOT_FOUND',
          message: 'Reciever is EMPTY, no channel found.',
        });
      }
      const newMessage = await ctx.prisma.directMessages.create({
        data: {
          text: input.text,
          senderId: ctx.session.user.id,
          recieverId: input.reciever,
        },
        include: {
          Sender: true,
        },
      });
      ee.emit('addDm', { dm: newMessage, channelId: input.channelId });
      return newMessage;
    },
  })
  .mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
        include: {
          accounts: true,
          sessions: true,
        },
      });
      return deletedUser;
    },
  });

