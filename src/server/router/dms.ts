import { DirectMessages, User } from '@prisma/client';
import * as trpc from '@trpc/server';
import { EventEmitter } from 'events';
import { z } from 'zod';
import { createProtectedRouter } from './context';

const ee = new EventEmitter();

// Example router with queries that can only be hit if the user requesting is signed in
export const MessagesRouter = createProtectedRouter()
  .subscription('onAdd', {
    resolve() {
      return new trpc.Subscription<
        DirectMessages & {
          Sender: User;
        }
      >((emit) => {
        const onAdd = (
          data: DirectMessages & {
            Sender: User;
          }
        ) => {
          console.log('Working?');
          emit.data(data);
        };

        ee.on('create', onAdd);

        return () => {
          ee.off('create', onAdd);
        };
      });
    },
  })
  .query('infiniteDms', {
    input: z.object({
      limit: z.number().min(1).max(100).nullish(),
      cursor: z.number().nullish(),
      friendId: z.string(),
    }),
    async resolve({ input, ctx }) {
      const limit = input.limit ?? 50;
      const { cursor, friendId } = input;
      const items = await ctx.prisma.directMessages.findMany({
        where: {
          recieverId: friendId,
          senderId: ctx.session.user.id,
        },
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: 'asc',
        },
        include: {
          Sender: true,
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        nextCursor = nextItem!.id;
      }

      return { items, nextCursor };
    },
  })
  .mutation('create', {
    input: z.object({
      text: z.string(),
      reciever: z.string(),
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
      ee.emit('create', newMessage);
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

