import { WebSocketServer } from "ws";

import { type Messages, type User } from "@acme/db";
import { redisClient } from "@acme/redis";

import { heartbeat, keepAlive } from "./utils/keepalive.js";
import { type Socket } from "./utils/state.js";

const wss = new WebSocketServer({ port: Number(process.env.PORT) });

void redisClient.subscribe("addMessage");

wss.on("connection", (ws: Socket) => {
  redisClient.on("message", (chan: any, jsonData: string) => {
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

  ws.on("pong", heartbeat);
});

const interval = keepAlive(wss);
wss.on("close", () => clearInterval(interval));
