import {z} from "zod";

import {createTRPCRouter, protectedProcedure} from "../trpc";

export const inviteRouter = createTRPCRouter({
        getAll: protectedProcedure.input(z.object({id: z.string()})).query(async ({input, ctx}) => {
            return await ctx.prisma.serverInvites.findMany({
                where: {
                    serverId: input.id
                }
            });
        }),
        get: protectedProcedure
            .input(z.object({id: z.string()}))
            .query(async ({ctx, input}) => {
                return await ctx.prisma.serverInvites.findFirstOrThrow({
                    where: {
                        id: input.id,
                    },
                });
            }),
        create: protectedProcedure
            .input(z.object({serverId: z.string()}))
            .mutation(async ({ctx, input}) => {
                return await ctx.prisma.serverInvites.create({
                    data: {
                        serverId: input.serverId,
                        userId: ctx.session?.user?.id,
                    }
                })
            }),
    })
;
