import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { createProtectedRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const UserRouter = createProtectedRouter()
  .query('getSession', {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
  .query('friends.getAll', {
    async resolve({ ctx }) {
      console.log('Freidns!Q@?#');
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
    },
  })
  .query('friends.get', {
    input: z.object({
      friend: z.string(),
    }),
    async resolve({ ctx, input }) {
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
  .mutation('friend.add', {
    input: z.object({
      username: z.string(),
    }),
    async resolve({ ctx, input }) {
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

      console.log('Woij', hasFrinedRequest, foundFriend);
      if (foundFriend > 0) {
        throw new TRPCError({
          code: 'CONFLICT',
          cause: 'Unique constraint failed',
          message: 'That person is already your friend.',
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
              code: 'CONFLICT',
              cause: err,
              message: 'That person is already your friend.',
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
            code: 'CONFLICT',
            cause: err,
            message: 'That person is already your friend.',
          });
        });
      console.log('FriendRequests', newUser);
      return newUser;
    },
  })
  .query('friends.requests.getAll', {
    async resolve({ ctx }) {
      const friendRequests = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          FriendRequests: true,
        },
      });

      return friendRequests;
    },
  })
  .query('friends.requests.getSent', {
    async resolve({ ctx }) {
      const friendRequests = await ctx.prisma.user.findUnique({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          SentFriendRequets: true,
        },
      });

      return friendRequests;
    },
  })
  .mutation('friends.requests.accept', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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
    },
  })
  .mutation('friends.requests.decline', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
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

