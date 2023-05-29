import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Publisher } from "@zapix/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ChannelRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const foundChannel = await ctx.prisma.channels
        .findFirstOrThrow({
          where: {
            id: input.id,
          },
        })
        .catch((e) => {
          throw new TRPCError({
            code: "CLIENT_CLOSED_REQUEST",
            cause: e,
          });
        });

      return foundChannel;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        private: z.boolean(),
        serverId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const channel = await ctx.prisma.channels.create({
        data: {
          name: input.title,
          default: false,
          private: input.private,
          Server: {
            connect: {
              id: input.serverId,
            },
          },
        },
      });
      console.log("Adderwer");
      void Publisher.publish(
        "updateServer",
        JSON.stringify({ Channel: channel }),
      );
      return channel;
    }),
});
