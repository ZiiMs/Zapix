import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const friendRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    console.log("Freidns!Q@?#");
    const friends = await ctx.prisma.user.findUnique({
      where: {
        id: ctx.session.user.id,
      },
      select: {
        FriendOf: {
          select: {
            id: true,
            User: true,
          },
        },
        Friend: {
          select: {
            id: true,
            Friend: true,
          },
        },
      },
    });
    const Friends = friends?.FriendOf.map(({ User, ...fri }) => ({
      ...fri,
      Friend: User,
    }));
    let newFriends = friends?.Friend;
    if (Friends && friends) {
      newFriends = Friends.concat(friends.Friend);
    }
    return newFriends;
  }),
  get: protectedProcedure
    .input(z.object({ friend: z.string() }))
    .query(async ({ ctx, input }) => {
      const friends = await ctx.prisma.friend.findFirstOrThrow({
        where: {
          friendId: input.friend,
        },
        include: {
          Friend: true,
          Messages: {
            include: {
              Reciever: {
                include: {
                  Friend: true,
                  User: true,
                },
              },
            },
          },
        },
      });

      return friends;
    }),
  add: protectedProcedure
    .input(z.object({ username: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const FriendsFoundPromise = ctx.prisma.friend.count({
        where: {
          OR: [
            {
              User: {
                username: input.username,
              },
              friendId: ctx.session.user.id,
            },
            {
              Friend: {
                username: input.username,
              },
              userId: ctx.session.user.id,
            },
          ],
        },
      });

      const FriendRequestPromise = ctx.prisma.user.count({
        where: {
          username: input.username,
          SentFriendRequets: {
            some: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      const [hasFrinedRequest, foundFriend] = await Promise.all([
        FriendRequestPromise,
        FriendsFoundPromise,
      ]);

      console.log("Woij", hasFrinedRequest, foundFriend);
      if (foundFriend > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          cause: "Unique constraint failed",
          message: "That person is already your friend.",
        });
      }

      if (hasFrinedRequest > 0) {
        const newUser = await ctx.prisma.user
          .update({
            where: {
              username: input.username,
            },
            data: {
              SentFriendRequets: {
                disconnect: {
                  id: ctx.session.user.id,
                },
              },
              Friend: {
                create: {
                  friendId: ctx.session.user.id,
                },
              },
            },
          })
          .catch((err) => {
            throw new TRPCError({
              code: "CONFLICT",
              cause: err,
              message: "That person is already your friend.",
            });
          });

        return newUser;
      }

      const newUser = await ctx.prisma.user
        .update({
          where: {
            username: input.username,
          },
          data: {
            FriendRequests: {
              connect: {
                id: ctx.session.user.id,
              },
            },
          },
        })
        .catch((err) => {
          throw new TRPCError({
            code: "CONFLICT",
            cause: err,
            message: "That person is already your friend.",
          });
        });
      console.log("FriendRequests", newUser);
      return newUser;
    }),
});
