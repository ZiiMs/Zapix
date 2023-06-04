import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  // create: protectedProcedure
  //   .input(z.object({ username: z.string() }))
  //   .mutation(async ({ ctx, input }) => {
  //     const newUser = await ctx.prisma.user.update({
  //       data: {
  //         username: input.username,
  //         isRegistered: true,
  //       },
  //       where: {
  //         id: ctx.auth.userId,
  //       },
  //     });
  //     return newUser;
  //   }),
  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const deletedUser = await ctx.prisma.user.delete({
        where: {
          id: input.id,
        },
      });
      return deletedUser;
    }),
  upsert: publicProcedure
    .input(
      z.object({
        id: z.string().min(1),
        email: z.string().email(),
        emailVerified: z.boolean(),
        name: z.string(),
        username: z.string().nullable(),
        image: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const upsertUser = await ctx.prisma.user.upsert({
        where: {
          id: input.id,
        },
        update: {
          id: input.id,
          email: input.email,
          emailVerified: input.emailVerified,
          name: input.name,
          image: input.image,
          username: input.username || input.id,
        },
        create: {
          id: input.id,
          email: input.email,
          emailVerified: input.emailVerified,
          name: input.name,
          image: input.image,
          username: input.username || input.id,
        },
      });

      return upsertUser;
    }),
});
