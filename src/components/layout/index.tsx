import React, { PropsWithChildren, ReactNode } from 'react';
import Navbar from './navbar';

const Layout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  return (
    <div className='flex flex-row'>
      <Navbar />
      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        {children}
      </main>
    </div>
  );
};

export default Layout;

