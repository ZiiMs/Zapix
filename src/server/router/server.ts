import { z } from 'zod';
import { createRouter } from './context';

// Example router with queries that can only be hit if the user requesting is signed in
export const serverRouter = createRouter()
  .query('get.all', {
    async resolve({ ctx }) {
      const data = await ctx.prisma.server.findMany({
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
  .query('get', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ input, ctx }) {
      const data = await ctx.prisma.server.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          Channels: true,
        },
      });

      return data;
    },
  })
  .mutation('create', {
    input: z.object({
      name: z.string(),
      image: z.string().nullable(),
    }),
    async resolve({ input, ctx }) {
      const server = await ctx.prisma.server.create({
        data: {
          name: input.name,
          image: input.image ?? undefined,
          Users: {
            connect: {
              id: ctx.session?.user?.id,
            },
          },
          Channels: {
            create: {
              name: 'General',
              private: false,
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
      const server = await ctx.prisma.server.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      return server;
    },
  });

