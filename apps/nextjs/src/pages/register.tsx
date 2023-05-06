import { signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useRef, useState, type ReactElement } from "react";
import LoginLayout from "~/components/layout/login";
import { api } from "~/utils/api";
import { type NextPageWithLayout } from "./_app";

const Register: NextPageWithLayout = () => {
  const ref = useRef<HTMLInputElement>(null);
  const [username, setUsername] = useState("");
  const [isSignOut, setSignOut] = useState(false);
  const router = useRouter();
  const { mutate: CreateUser, status: createStatus } =
    api.user.create.useMutation({
      onSuccess: async (data) => {
        console.log("NewUser: ", data);
        await router.push("/");
      },
    });

  const { mutate: DeleteUser, status: deleteStatus } =
    api.user.delete.useMutation({
      onSuccess: (data) => {
        console.log("DeletedUser", data);
        setSignOut(true);
      },
    });

  const { data: session, status } = useSession();

  useEffect(() => {
    if (ref.current !== null) {
      ref.current?.focus();
    }
  });

  useEffect(() => {
    const handleSignOut = async () => {
      const data = await signOut({ redirect: false, callbackUrl: "/login" });
      console.log(data);
      await router.push(data.url);
    };

    if (isSignOut) {
      void handleSignOut();
      setSignOut(false);
    }
  }, [isSignOut, router]);

  if (status === "loading" || !session) {
    return <div>Loading....</div>;
  }

  return (
    <>
      <Head>
        <title>Radiance - Login</title>
        <meta name="description" content="Login page for radiance app." />
        {/* <link rel='icon' href='/favicon.ico' /> */}
      </Head>
      <div className="flex flex-col items-center justify-center rounded bg-rad-black-900 p-4 shadow-black drop-shadow-xl">
        <h1 className="pb-4 text-xl font-bold">Register</h1>
        <div className="flex flex-col">
          <label>Name</label>
          <input
            className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 disabled:cursor-not-allowed disabled:bg-rad-black-800/60 disabled:text-rad-light-200 disabled:text-opacity-30"
            disabled={true}
            value={session.user?.name || ""}
          />
        </div>
        <div className="flex flex-col">
          <label>Username</label>
          <input
            ref={ref}
            value={username}
            onChange={(e) => {
              e.preventDefault();
              setUsername(e.currentTarget.value);
            }}
            className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600"
          />
        </div>
        <div className="flex flex-col">
          <label>Email</label>
          <input
            className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 disabled:cursor-not-allowed disabled:bg-rad-black-800/60 disabled:text-rad-light-200 disabled:text-opacity-30"
            disabled={true}
            value={session.user?.email || ""}
          />
        </div>
        <div className="flex w-full flex-row justify-between pt-4">
          <button
            className="rounded bg-rad-black-600 p-2"
            disabled={deleteStatus === "loading"}
            onClick={(e) => {
              e.preventDefault();
              if (session.user) {
                DeleteUser({ id: session.user?.id });
              } else {
                void router.push("/login");
              }
            }}
          >
            Close
          </button>
          <button
            className="rounded bg-rad-black-600 p-2"
            disabled={createStatus === "loading"}
            onClick={(e) => {
              e.preventDefault();
              if (username !== "") {
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
