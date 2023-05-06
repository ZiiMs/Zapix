import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getSession: protectedProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  create: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
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
    }),
});
