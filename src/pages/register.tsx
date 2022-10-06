import { signOut, useSession } from 'next-auth/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ReactElement, useEffect, useRef, useState } from 'react';
import LoginLayout from '../components/layout/login';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const Register: NextPageWithLayout = () => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);
  const ref = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState('');
  const [isSignOut, setSignOut] = useState(false);
  const router = useRouter();
  const { mutate: CreateUser, status: createStatus } = trpc.useMutation(
    ['user.create'],
    {
      onSuccess: async (data) => {
        console.log('NewUser: ', data);
        router.push('/');
      },
    }
  );
  const { mutate: DeleteUser, status: deleteStatus } = trpc.useMutation(
    ['user.delete'],
    {
      onSuccess: (data) => {
        console.log('DeletedUser', data);
        setSignOut(true);
      },
    }
  );
  const { data: session, status } = useSession();

  useEffect(() => {
    if (ref.current !== null) {
      ref.current?.focus();
    }
  });

  useEffect(() => {
    const handleSignOut = async () => {
      const data = await signOut({ redirect: false, callbackUrl: '/login' });
      console.log(data);
      router.push(data.url);
    };

    if (isSignOut) {
      handleSignOut();
      setSignOut(false);
    }
  }, [isSignOut, router]);

  if (status === 'loading' || !session) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Head>
        <title>Radiance - Login</title>
        <meta name='description' content='Login page for radiance app.' />
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <div className='rounded bg-rad-black-900 p-4 drop-shadow-xl shadow-black flex flex-col justify-center items-center'>
        <h1 className='font-bold text-xl pb-4'>Register</h1>
        <div className='flex flex-col'>
          <label>Name</label>
          <input
            className='rounded p-1 bg-transparent disabled:text-opacity-30 disabled:cursor-not-allowed disabled:text-rad-light-200 disabled:bg-rad-black-800/60 outline-rad-black-600 outline-2 outline'
            disabled={true}
            value={session.user?.name || ''}
          />
        </div>
        <div className='flex flex-col'>
          <label>Username</label>
          <input
            ref={ref}
            value={username}
            onChange={(e) => {
              e.preventDefault();
              setUsername(e.currentTarget.value);
            }}
            className='rounded p-1 bg-transparent outline-rad-black-600 outline-2 outline'
          />
        </div>
        <div className='flex flex-col'>
          <label>Email</label>
          <input
            className='rounded p-1 bg-transparent disabled:text-opacity-30 disabled:cursor-not-allowed disabled:text-rad-light-200 disabled:bg-rad-black-800/60 outline-rad-black-600 outline-2 outline'
            disabled={true}
            value={session.user?.email || ''}
          />
        </div>
        <div className='justify-between flex flex-row w-full pt-4'>
          <button
            className='p-2 bg-rad-black-600 rounded'
            disabled={deleteStatus === 'loading'}
            onClick={(e) => {
              e.preventDefault();
              if (session.user) {
                DeleteUser({ id: session.user?.id });
              } else {
                router.push('/login');
              }
            }}
          >
            Close
          </button>
          <button
            className='p-2 bg-rad-black-600 rounded'
            disabled={createStatus === 'loading'}
            onClick={(e) => {
              e.preventDefault();
              if (username !== '') {
                CreateUser({ username: username });
              }
            }}
          >
            SignUp
          </button>
        </div>
      </div>
    </>
  );
};

export default Register;

const getLayout = (page: ReactElement) => {
  return <LoginLayout>{page}</LoginLayout>;
};

Register.getLayout = getLayout;

