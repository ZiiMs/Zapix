import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, ReactNode, useEffect } from 'react';
import Navbar from './navbar';

const Layout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated');
      router.push('/login');
    },
  });

  useEffect(() => {
    const checkIsRegistered = async () => {
      const data = await getSession({ broadcast: true });
      if (!data?.user?.isRegistered) {
        router.push('/register');
      }
    };
    if (status === 'authenticated') {
      checkIsRegistered();
    }
  }, [router, status]);

  if (status === 'loading') {
    return <div>Loading</div>;
  }

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

