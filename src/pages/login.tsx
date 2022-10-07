import LoginLayout from '@/components/layout/login';
import { signIn } from 'next-auth/react';
import Head from 'next/head';
import { ReactElement } from 'react';
import { NextPageWithLayout } from './_app';

const Login: NextPageWithLayout = () => {

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
            signIn('google', { redirect: false, callbackUrl: '/register' });e
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

