import { type WebSocket, type WebSocketServer } from "ws";

import { type Socket } from "./state.js";

export const keepAlive = (wss: WebSocketServer) =>
  setInterval(
    () =>
      wss.clients.forEach((ws: Socket) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
      }),
    30_000,
  );

export function heartbeat() {
  this.isAlive = true;
}
