import { type WebSocket } from "ws";

export type Socket = WebSocket & { isAlive: boolean };
