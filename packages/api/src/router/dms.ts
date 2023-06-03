import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { Publisher } from "@zapix/redis";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const DirectMessageRouter = createTRPCRouter({
  // onAdd: protectedProcedure
  //   .input(
  //     z.object({
  //       channelId: z.string(),
  //     }),
  //   )
  //   .subscription(({ input }) => {
  //     return observable<
  //       DirectMessages & {
  //         Sender: User;
  //       }
  //     >((emit) => {
  //       const onAdd = (data: {
  //         dm: DirectMessages & {
  //           Sender: User;
  //         };
  //         channelId: string;
  //       }) => {
  //         if (input.channelId === data.channelId) {
  //           emit.next(data.dm);
  //         }
  //       };

  //       ee.on("addDm", onAdd);

  //       return () => {
  //         ee.off("addDm", onAdd);
  //       };
  //     });
  //   }),
  infiniteDms: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().or(z.date()).nullish(),
        friendId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 50;
      const { cursor, friendId } = input;
      const items = await ctx.prisma.directMessages.findMany({
        where: {
          Reciever: {
            id: friendId,
          },
        },
        take: limit + 1,
        cursor: cursor ? { createdAt: cursor } : undefined,
        orderBy: {
          createdAt: "desc",
        },
        skip: 0,
        include: {
          Sender: true,
        },
      });
      let nextCursor: typeof cursor | null = null;
      if (items.length > limit) {
        const nextItem = items.pop();
        if (nextItem) {
          nextCursor = nextItem.createdAt;
        }
      }

      return { items, nextCursor };
    }),

  create: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        reciever: z.string(),
        channelId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.reciever === "") {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Reciever is EMPTY, no channel found.",
        });
      }
      const newMessage = await ctx.prisma.directMessages.create({
        data: {
          text: input.text,
          senderId: ctx.auth.userId,
          recieverId: input.reciever,
        },
        include: {
          Sender: true,
        },
      });
      console.log("Sending");
      void Publisher.publish(
        "addDm",
        JSON.stringify({ dm: newMessage, channelId: input.channelId }),
      );
      return newMessage;
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
