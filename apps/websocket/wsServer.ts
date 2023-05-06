import http from "http";
import { WebSocketServer } from "ws";

import { getServerSession, type Session } from "@acme/auth";
import { type Messages, type User } from "@acme/db";
import { redisClient } from "@acme/redis";

const port = parseInt(process.env.WS_PORT) || 3001;

// const server = http.createServer(async (req, res) => {
//   const proto = req.headers["x-forward-proto"];
//   if (proto && proto === "http") {
//     res.writeHead(303, {
//       location: `https://${req.headers.host}${req.headers.url ?? ""}`,
//     });
//     res.end();
//     return;
//   }
// });
const wss = new WebSocketServer({ port: port });

void redisClient.subscribe("addMessage");

wss.on("connection", (ws) => {
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  redisClient.on("message", async (chan, jsonData) => {
    switch (chan) {
      case "addMessage": {
        console.log("AddMessage");
        const data: Messages & { User: User } = JSON.parse(jsonData);
        const msg: { channel: string; data: Messages & { User: User } } = {
          channel: chan,
          data: data,
        };
        ws.send(JSON.stringify(msg));
        break;
      }
      default: {
        console.warn("No Channel found!", chan);
        break;
      }
    }
  });
  console.log(`➕➕ Connection (${wss.clients.size})`);
  ws.once("close", () => {
    console.log(`➖➖ Connection (${wss.clients.size})`);
  });
});

// const handler = applyWSSHandler({
//   wss,
//   router: appRouter,
//   createContext: createContextWSS,
// });

process.on("SIGTERM", () => {
  console.log("SIGTERM");
  // handler.broadcastReconnectNotification();
  wss.close();
});
// server.listen(port);

console.log("✅ WebSocket Server listening on ws://localhost:3001");
