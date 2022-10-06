import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactNode } from 'react';

const LoginLayout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const router = useRouter();
  const { status, data } = useSession({
    required: true,
    onUnauthenticated: () => {
      return;
    },
  });

  if (status === 'authenticated') {
    if (!data.user?.isRegistered) {
      if (router.asPath !== '/register') {
        router.push('/register');
        console.log(router.asPath);
      }
    } else {
      router.push('/');
    }
  }
  return (
    <div className='flex flex-row'>
      <main className='container mx-auto flex flex-col items-center justify-center min-h-screen p-4'>
        {children}
      </main>
    </div>
  );
};

export default LoginLayout;

