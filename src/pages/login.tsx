import { getProviders, signIn } from 'next-auth/react';
import Head from 'next/head';
import { ReactElement, useEffect } from 'react';
import LoginLayout from '../components/layout/login';
import { trpc } from '../utils/trpc';
import { NextPageWithLayout } from './_app';

const Login: NextPageWithLayout = () => {
  const hello = trpc.useQuery(['example.hello', { text: 'from tRPC' }]);


  return (
    <>
      <Head>
        <title>Radiance - Login</title>
        <meta name='description' content='Login page for radiance app.' />
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <div className='rounded bg-rad-black-900 p-4 drop-shadow-xl shadow-black'>
        <button
          onClick={(e) => {
            e.preventDefault();
            signIn('google');
          }}
          className='w-full outline outline-1 p-2 rounded font-medium outline-rad-black-400 text-rad-light-900 bg-white hover:bg-rad-light-100 active:bg-rad-light-100 active:scale-95'
        >
          <span>Sign in with Google</span>
        </button>
      </div>
    </>
  );
};

export default Login;

const getLayout = (page: ReactElement) => {
  return <LoginLayout>{page}</LoginLayout>;
};

Login.getLayout = getLayout;

