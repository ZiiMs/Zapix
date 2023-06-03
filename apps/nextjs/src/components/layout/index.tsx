// import { getSession, useSession } from 'next-auth/react';

import React, {
  useEffect,
  type PropsWithChildren,
  type ReactNode,
} from "react";
import { useRouter } from "next/router";
import { useUser } from "@clerk/clerk-react";

const Layout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const { isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading</div>;
  }

  return <div className="flex flex-row overflow-y-hidden">{children}</div>;
};

export default Layout;
