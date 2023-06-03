// import { useSession } from 'next-auth/react';

import React, { type PropsWithChildren, type ReactNode } from "react";
import { useRouter } from "next/router";

const LoginLayout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const router = useRouter();
  // const { status, data } = useSession({
  // required: true,
  // onUnauthenticated: () => {
  // return;
  // },
  // });
  //
  //

  // if (status === 'authenticated') {
  // if (!data.user?.isRegistered) {
  //     if (router.asPath !== '/register') {
  //       void router.push('/register');
  //       console.log(router.asPath);
  //     }
  //   } else {
  //     void router.push('/');
  //   }
  // }
  return (
    <div className="flex flex-row">
      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        {children}
      </main>
    </div>
  );
};

export default LoginLayout;
