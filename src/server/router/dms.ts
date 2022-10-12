import { z } from 'zod';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const MessagesRouter = createProtectedRouter()
  .mutation('create', {
    input: z.object({
      text: z.string(),
      reciever: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newMessage = await ctx.prisma.directMessages.create({
        data: {
          text: input.text,
          senderId: ctx.session.user.id,
          recieverId: input.reciever
        },
      });
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

