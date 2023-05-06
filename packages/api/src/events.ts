import { type DirectMessages, type Messages, type User } from '@prisma/client';
import { EventEmitter } from 'events';

interface MyEvents {
  addDm: (data: {
    dm: DirectMessages & {
      Sender: User;
    };
    channelId: string;
  }) => void;
  addMessage: (
    data: Messages & {
      User: User;
    }
  ) => void;
}

declare interface MyEventEmitter {
  on<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  off<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  once<TEv extends keyof MyEvents>(event: TEv, listener: MyEvents[TEv]): this;
  emit<TEv extends keyof MyEvents>(
    event: TEv,
    ...args: Parameters<MyEvents[TEv]>
  ): boolean;
}

class MyEventEmitter extends EventEmitter {}

export const ee = new MyEventEmitter();

