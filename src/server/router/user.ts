import { z } from 'zod';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const UserRouter = createProtectedRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .mutation('create', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
      const newUser = await ctx.prisma.user.update({
        data: {
          username: input.username,
          isRegistered: true,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
      return newUser;
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

