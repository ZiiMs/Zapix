import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Publisher } from "@zapix/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const ChannelMessageRouter = createTRPCRouter({
  getInfinite: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        id: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor } = input;
      const items = await ctx.prisma.messages.findMany({
        where: {
          channelsId: input.id,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        skip: 0,
        include: {
          User: true,
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        if (nextItem) {
          nextCursor = nextItem.id;
        }
      }
      return { items, nextCursor };
    }),
  create: protectedProcedure
    .input(z.object({ body: z.string(), channelId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const newMessage = await ctx.prisma.messages.create({
        data: {
          body: input.body,
          channelsId: input.channelId,
          userId: ctx.auth.userId,
        },
        include: {
          User: true,
        },
      });
      console.log("Adderwer");
      void Publisher.publish(
        "addMessage",
        JSON.stringify({ message: newMessage }),
      );
      return newMessage;
    }),
});
