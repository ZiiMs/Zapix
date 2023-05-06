import { authRouter } from "./router/auth";
import channelRouter from "./router/channel";
import { MessageRouter } from "./router/dms";
import { friendRouter } from "./router/friends";
import { postRouter } from "./router/post";
import { friendRequestsRouter } from "./router/requests";
import { serverRouter } from "./router/server";
import { userRouter } from "./router/user";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  channel: channelRouter,
  user: userRouter,
  friends: friendRouter,
  request: friendRequestsRouter,
  server: serverRouter,
  dms: MessageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
