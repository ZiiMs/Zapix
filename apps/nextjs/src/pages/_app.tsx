import { type ReactElement, type ReactNode } from "react";
import { type NextPage } from "next";
import type { AppProps, AppType } from "next/app";

import { api } from "~/utils/api";
import "../styles/globals.css";
// import { ClerkProvider } from "@zapix/auth";
import { ClerkProvider } from "@clerk/nextjs";

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout<T = object> = AppProps<T> & {
  Component: NextPageWithLayout;
};

const MyApp: AppType = ({
  Component,
  pageProps: { ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <ClerkProvider {...pageProps}>
      {getLayout(<Component {...pageProps} />)}
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
