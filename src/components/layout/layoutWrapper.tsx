import React, { PropsWithChildren, ReactNode } from 'react';
import Header from './header';

const LayoutWrapper: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  return (
    <div className='flex flex-col w-full h-screen overflow-y-hidden'>

      <main className='w-full h-full items-center justify-center flex overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900'>
        {children}
      </main>
    </div>
  );
};

export default LayoutWrapper;

