import { type Channels, type Server } from "@prisma/client";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const serverRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
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
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const data = await ctx.prisma.server.findFirstOrThrow({
        where: {
          id: input.id,
        },
        include: {
          Channels: true,
        },
      });

      return data;
    }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), image: z.string().nullable() }))
    .mutation(async ({ ctx, input }) => {
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
              name: "General",
              default: true,
              private: false,
            },
          },
        },
        include: {
          Channels: true,
        },
      });
      const updatedServer = await ctx.prisma.server.update({
        where: {
          id: server.id,
        },
        data: {
          defaultChannelId: server.Channels[0]?.id,
        },
      });
      const newServer: Server & {
        Channels: Channels[];
      } = {
        ...updatedServer,
        Channels: server.Channels,
      };
      return newServer;
    }),
  join: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const server = await ctx.prisma.server.findFirstOrThrow({
        where: {
          id: input.id,
        },
      });
      return server;
    }),
});
