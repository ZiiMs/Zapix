// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { serverRouter } from "./server";
import { UserRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("server.", serverRouter)
  .merge("user.", UserRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
