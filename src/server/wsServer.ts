import { appRouter } from '@/server/router';
import { createContextWSS } from '@/server/router/context';
import { applyWSSHandler } from '@trpc/server/adapters/ws';
import ws from 'ws';

const wss = new ws.Server({ port: 3001 });

const handler = applyWSSHandler({
  wss,
  router: appRouter,
  createContext: createContextWSS,
});

wss.on('connection', (ws) => {
  console.log(`Opened Connection (${wss.clients.size})`);
  ws.once('close', () => {
    console.log(`Closed Connection (${wss.clients.size})`);
  });
});

console.log('Websocket server listening on ws://localhost:3001');

process.on('SIGTERM', () => {
  console.log('SIGTERM');
  handler.broadcastReconnectNotification();
  wss.close();
});
