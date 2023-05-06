import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRequestsRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const friendRequests = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        FriendRequests: true,
      },
    });

    return friendRequests;
  }),
  getSent: protectedProcedure.query(async ({ ctx }) => {
    const friendRequests = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        SentFriendRequets: true,
      },
    });

    return friendRequests;
  }),

  accept: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const acceptedFriends = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          FriendRequests: {
            disconnect: {
              id: input.id,
            },
          },
          Friend: {
            create: {
              friendId: input.id,
            },
          },
        },
      });
      return acceptedFriends;
    }),
  decline: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const declinedFriend = await ctx.prisma.user.update({
        where: {
          id: ctx.session.user.id,
        },
        data: {
          FriendRequests: {
            disconnect: {
              id: input.id,
            },
          },
        },
      });
      return declinedFriend;
    }),
});
