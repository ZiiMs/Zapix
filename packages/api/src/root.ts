import {ChannelRouter} from "./router/channel";
import {DirectMessageRouter} from "./router/dms";
import {friendRouter} from "./router/friends";
import {ChannelMessageRouter} from "./router/messages";
import {friendRequestsRouter} from "./router/requests";
import {serverRouter} from "./router/server";
import {userRouter} from "./router/user";
import {createTRPCRouter} from "./trpc";
import {inviteRouter} from "./router/invites";

export const appRouter = createTRPCRouter({
  channel: ChannelRouter,
  user: userRouter,
  friends: friendRouter,
  request: friendRequestsRouter,
  server: serverRouter,
  dms: DirectMessageRouter,
  message: ChannelMessageRouter,
  invite: inviteRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
