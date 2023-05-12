import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";
import { type StoreApi, type UseBoundStore } from "zustand";

import { type AppRouter } from "@acme/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:3000`; // dev SSR should use localhost
};

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S,
) => {
  const store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (const k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

// const getBaseUrl = (websocket = false) => {
//   if (typeof window !== "undefined") {
//     console.log("Whatisthis?!?: ", typeof window);
//     if (!websocket) {
//       return "";
//     }
//   } // browser should use relative url
//   if (process.env.VERCEL_URL) {
//     console.log("VERCEL_URL");
//     return websocket
//       ? "wss://PROD_RAILWAY.railway.app"
//       : "https://PROD_VERCEL.vercel.app"; // SSR should use vercel url
//   }
//   if (websocket) {
//     console.log("Weboscket POORT:", websocket ? 3001 : 3000);
//   }
//   return `${websocket ? "ws" : "http"}://localhost:${websocket ? 3001 : 3000}`;
// };

// const wsClient = createWSClient({
//   url: getBaseUrl(true),
//   onClose(cause) {
//     console.log(cause);
//   },
//   onOpen() {
//     console.log("opens");
//   },
// });

export const api = createTRPCNext<AppRouter>({
  config() {
    return {
      transformer: superjson,
      links: [httpBatchLink({ url: `${getBaseUrl()}/api/trpc` })],
    };
  },
  ssr: false,
});

export { type RouterInputs, type RouterOutputs } from "@acme/api";
