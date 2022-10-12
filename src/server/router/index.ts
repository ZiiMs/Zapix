// src/server/router/index.ts
import superjson from 'superjson';
import { createRouter } from './context';
import { MessagesRouter } from './dms';

import { serverRouter } from './server';
import { UserRouter } from './user';

export const appRouter = createRouter()
  .transformer(superjson)
  .merge('server.', serverRouter)
  .merge('dm.', MessagesRouter)
  .merge('user.', UserRouter);

// export type definition of API
export type AppRouter = typeof appRouter;

