import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import superjson from "superjson";

import { type AppRouter } from "@acme/api";

const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

  return `http://localhost:3000`; // dev SSR should use localhost
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
