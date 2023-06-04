import { type ReactElement } from "react";
import Head from "next/head";
// import { signIn } from "next-auth/react";
// import { useSignIn } from "@clerk/clerk-react";
import { useSignIn } from "@clerk/clerk-react";
import { type OAuthStrategy } from "@clerk/nextjs/dist/types/server";

import LoginLayout from "~/components/layout/login";
import { type NextPageWithLayout } from "./_app";

const Login: NextPageWithLayout = () => {
  // const { isLoaded, signIn, setActive } = useSignIn();
  const { isLoaded, signIn } = useSignIn();

  if (!isLoaded) {
    return null;
  }
  //
  // const handleSubmit = async (e: MouseEvent<HTMLButtonElement>) => {
  //   e.preventDefault();
  //   await signUp
  //     .create({
  //       externalAccountStrategy: "oauth_google",
  //       strategy: "oauth_google",
  //       actionCompleteRedirectUrl: "/",
  //       redirectUrl: "/",
  //     })
  //     .then((result) => {
  //       console.log(result);
  //       if (result.status === "complete") {
  //         setActive({ session: result.createdSessionId });
  //       }
  //     })
  //     .catch((err) => console.error("error", err.errors[0].longMessage));
  // };
  //
  const SignInOauth = (strategy: OAuthStrategy) => {
    return signIn.authenticateWithRedirect({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/channels/me",
    });
  };
  return (
    <>
      <Head>
        <title>Zappix - Login</title>
        <meta name="description" content="Login page for Zappix app." />
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <div className="rounded bg-rad-black-900 p-4 shadow-black drop-shadow-xl">
        <button
          onClick={() =>
            SignInOauth("oauth_google")
              .then()
              .catch((e) => console.error(e))
          }
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
