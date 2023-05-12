import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import useTitleStore from "src/stores/titleStore";

import { api } from "~/utils/api";
import CustomImage from "../CustomImage";
import CreateServerModal from "../modal/CreateServer";
import ChannelList from "./navbarList/channelList";
import FriendsList from "./navbarList/friendsList";

export enum Types {
  Friends,
  Channels,
}

const Navbar: React.FC<{ type?: Types }> = ({ type = Types.Friends }) => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { server } = router.query;
  const { data: Servers } = api.server.getAll.useQuery();

  const { data: session } = useSession({ required: true });
  const setTitle = useTitleStore.use.setTitle();

  const DmButton = () => {
    if (router.asPath.toLowerCase().includes("/channels/me")) {
      return (
        <button className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-rad-black-500 p-2 hover:animate-roundedOn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
            <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
          </svg>
        </button>
      );
    } else {
      return (
        <Link href={"/channels/me"}>
          <button
            className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-rad-black-500 p-2 hover:animate-roundedOn"
            onClick={() => {
              setTitle("Friends");
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
            >
              <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z" />
              <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z" />
            </svg>
          </button>
        </Link>
      );
    }
  };

  return (
    <nav className="flex flex-row">
      <div className="flex w-full max-w-xs flex-row">
        <div className="flex w-full flex-row">
          <div className=" flex w-full max-w-[4rem] flex-col items-center bg-rad-black-800 p-2">
            <DmButton />

            <hr className="mt-2 w-full border-rad-black-500" />
            <div className="mt-2 flex flex-col space-y-2">
              {Servers
                ? Servers.map((server) => (
                    <Link
                      key={server.id}
                      href={`/channels/${encodeURIComponent(server.id)}/${
                        server.defaultChannelId ?? ""
                      }`}
                    >
                      <CustomImage
                        name={server.name}
                        src={server.image ?? undefined}
                        width={44}
                        height={44}
                        className={
                          "h-[44px] w-[44px] rounded-full bg-rad-black-500 text-lg font-bold hover:animate-roundedOn"
                        }
                      />
                    </Link>
                  ))
                : null}
              <button
                className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-rad-black-500 p-2 hover:animate-roundedOn"
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Workgin");
                  setOpenModal(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={
              "relative flex h-full w-60 flex-col justify-between bg-rad-black-700 "
            }
          >
            {type === Types.Friends ? <FriendsList /> : <ChannelList />}
            <div className="flex flex-row items-center bg-rad-black-900 p-2 ">
              <CustomImage
                name={session?.user?.name ?? ""}
                src={session?.user?.image ?? undefined}
                width={32}
                height={32}
                className={"rounded-full bg-rad-black-500 text-lg font-bold"}
                onClick={() => {
                  void signOut();
                }}
              />
              <span className="px-2 font-semibold">
                {session?.user?.username}
              </span>
            </div>
          </div>
          <CreateServerModal
            isOpen={openModal}
            onClose={() => setOpenModal(false)}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
