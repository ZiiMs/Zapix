import React, { type PropsWithChildren, type ReactNode } from 'react';
import useTitleStore from 'src/stores/titleStore';

const Header: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const title = useTitleStore((state) => state.title);

  return (
    <div className='flex flex-col w-full h-screen overflow-y-hidden'>
      <div className='bg-rad-black-600 max-h-16 h-full flex flex-col justify-center w-full border-b-[1px] overflow-y-hidden border-rad-black-800'>
        <h1 className='font-bold text-xl p-2'>{title}</h1>
      </div>
      {children}
    </div>
  );
};

export default Header;

