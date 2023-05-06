import { getSession, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, {
  useEffect,
  type PropsWithChildren,
  type ReactNode
} from 'react';

const Layout: React.FC<{ children: PropsWithChildren<ReactNode> }> = ({
  children,
}) => {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated');
      void router.push('/login');
    },
  });

  useEffect(() => {
    const checkIsRegistered = async () => {
      const data = await getSession({ broadcast: true });
      if (!data?.user?.isRegistered) {
        void router.push('/register');
      }
    };
    if (status === 'authenticated') {
      void checkIsRegistered();
    }
  }, [router, status]);

  if (status === 'loading') {
    return <div>Loading</div>;
  }

  return <div className='flex flex-row overflow-y-hidden'>{children}</div>;
};

export default Layout;

