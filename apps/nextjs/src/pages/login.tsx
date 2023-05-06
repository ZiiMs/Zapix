import { signIn } from "next-auth/react";
import Head from "next/head";
import { type ReactElement } from "react";
import LoginLayout from "~/components/layout/login";
import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Radiance - Login</title>
        <meta name="description" content="Login page for radiance app." />
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <div className="rounded bg-rad-black-900 p-4 shadow-black drop-shadow-xl">
        <button
          onClick={(e) => {
            e.preventDefault();
            void signIn("google", {
              redirect: false,
              callbackUrl: "/register",
            });
          }}
          className="w-full rounded bg-white p-2 font-medium text-rad-light-900 outline outline-1 outline-rad-black-400 hover:bg-rad-light-100 active:scale-95 active:bg-rad-light-100"
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
