// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { exampleRouter } from "./example";
import { serverRouter } from "./server";
import { UserRouter } from "./user";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("server.", serverRouter)
  .merge("auth.", UserRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
