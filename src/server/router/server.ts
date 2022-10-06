import { z } from 'zod';
import { createProtectedRouter, createRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const serverRouter = createRouter()
  .query('get.all', {
    async resolve({ ctx }) {
      const data = await ctx.prisma.servers.findMany({
        where: {
          Users: {
            some: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });

      return data;
    },
  })
  .query('getSecretMessage', {
    resolve({ ctx }) {
      return 'He who asks a question is a fool for five minutes; he who does not ask a question remains a fool forever.';
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      image: z.string().nullable(),
    }),
    async resolve({ input, ctx }) {
      const server = await ctx.prisma.servers.create({
        data: {
          name: input.name,
          image: input.image ?? undefined,
          Users: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
        },
      });
      return server;
    },
  })
  .mutation('join', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const server = await ctx.prisma.servers.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      return server;
    },
  });

