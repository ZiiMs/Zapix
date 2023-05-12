import React, { type PropsWithChildren, type ReactNode } from "react";
import useTitleStore from "src/stores/titleStore";

const Header: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const title = useTitleStore.use.title();

  return (
    <div className="flex h-screen w-full flex-col overflow-y-hidden">
      <div className="flex h-full max-h-16 w-full flex-col justify-center overflow-y-hidden border-b-[1px] border-rad-black-800 bg-rad-black-600">
        <h1 className="p-2 text-xl font-bold">{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Header;
