// src/server/router/index.ts
import superjson from "superjson";
import { createRouter } from "./context";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { serverRouter } from "./server";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("server.", serverRouter)
  .merge("auth.", protectedExampleRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
