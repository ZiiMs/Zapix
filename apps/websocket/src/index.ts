import { WebSocketServer } from "ws";

import { type DirectMessages, type Messages, type User } from "@zappix/db";
import { Subscriber } from "@zappix/redis";

import { heartbeat, keepAlive } from "./utils/keepalive.js";
import { type Socket } from "./utils/state.js";

const wss = new WebSocketServer({
  port: Number(process.env.PORT),
});

void Subscriber.subscribe("addMessage");
void Subscriber.subscribe("addDm");

wss.on("connection", (ws: Socket) => {
  Subscriber.on("message", (chan: string, jsonData: string) => {
    switch (chan) {
      case "addMessage": {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: Messages & { User: User } = JSON.parse(jsonData);
        const msg: { channel: string; data: Messages & { User: User } } = {
          channel: chan,
          data: data,
        };
        ws.send(JSON.stringify(msg));
        break;
      }
      case "addDm": {
        console.log("addDm");
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const data: {
          dm: DirectMessages & {
            Sender: User;
          };
          channelId: string;
        } = JSON.parse(jsonData);
        const dm: {
          channel: string;
          data: {
            dm: DirectMessages & {
              Sender: User;
            };
            channelId: string;
          };
        } = {
          channel: chan,
          data: data,
        };
        ws.send(JSON.stringify(dm));
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
