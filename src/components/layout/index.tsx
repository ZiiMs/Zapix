import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, {
  PropsWithChildren,
  ReactNode,
  useEffect,
  useState
} from 'react';
import Header from './header';
import Navbar from './navbar';

const Layout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const router = useRouter();
  const [title, setTitle] = useState('Friends');
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
    <div className='flex flex-row overflow-y-hidden'>
      <Navbar
        setTitle={(e: string) => {
          setTitle(e);
        }}
      />
      <div className='flex flex-col w-full h-screen overflow-y-hidden'>
        <Header title={title} />

        <main className='w-full h-full items-center justify-center flex overflow-y-auto'>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

