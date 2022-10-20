import { trpc } from '@/utils/trpc';
import classNames from 'classnames';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useTitleStore from 'src/stores/titleStore';
import shallow from 'zustand/shallow';
import CustomImage from '../CustomImage';
import CreateServerModal from '../modal/CreateServer';
import ChannelList from './navbarList/channelList';
import FriendsList from './navbarList/friendsList';

export enum Types {
  Friends,
  Channels,
}

const Navbar: React.FC<{ type?: Types }> = ({ type = Types.Friends }) => {
  const [openModal, setOpenModal] = useState(false);
  const router = useRouter();
  const { server } = router.query;
  const { data: Servers } = trpc.useQuery(['server.get.all']);

  const { data: session } = useSession({ required: true });
  const { setTitle } = useTitleStore(
    (state) => ({ setTitle: state.setTitle }),
    shallow
  );

  const DmButton = () => {
    if (router.asPath.toLowerCase().includes('/channels/me')) {
      return (
        <button className='rounded-full hover:animate-roundedOn bg-rad-black-500 p-2 flex w-[44px] h-[44px] items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path d='M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z' />
            <path d='M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z' />
          </svg>
        </button>
      );
    } else {
      return (
        <Link href={'/channels/me'}>
          <button
            className='rounded-full hover:animate-roundedOn bg-rad-black-500 p-2 flex w-[44px] h-[44px] items-center justify-center'
            onClick={() => {
              setTitle('Friends');
            }}
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6'
            >
              <path d='M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z' />
              <path d='M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z' />
            </svg>
          </button>
        </Link>
      );
    }
  };

  return (
    <nav className='flex flex-row'>
      <div className='flex flex-row w-full max-w-xs'>
        <div className='flex flex-row w-full'>
          <div className=' p-2 w-full bg-rad-black-800 max-w-[4rem] items-center flex flex-col'>
            <DmButton />

            <hr className='w-full mt-2 border-rad-black-500' />
            <div className='flex flex-col mt-2 space-y-2'>
              {Servers
                ? Servers.map((server) => (
                    <Link
                      key={server.id}
                      href={`/channels/${encodeURIComponent(server.id)}`}
                    >
                      <CustomImage
                        name={server.name}
                        src={server.image ?? undefined}
                        width={44}
                        height={44}
                        className={
                          'rounded-full hover:animate-roundedOn w-[44px] h-[44px] bg-rad-black-500 font-bold text-lg'
                        }
                        onClick={() => {
                          setTitle(server.name);
                        }}
                      />
                    </Link>
                  ))
                : null}
              <button
                className='rounded-full hover:animate-roundedOn bg-rad-black-500 p-2 flex w-[44px] h-[44px] items-center justify-center'
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Workgin');
                  setOpenModal(true);
                }}
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 24 24'
                  fill='currentColor'
                  className='w-6 h-6'
                >
                  <path
                    fillRule='evenodd'
                    d='M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div
            className={
              'h-full w-60 flex flex-col relative justify-between bg-rad-black-700 '
            }
          >
            {type === Types.Friends ? <FriendsList /> : <ChannelList />}
            <div className='bg-rad-black-900 p-2 flex flex-row items-center '>
              <CustomImage
                name={session?.user?.name ?? ''}
                src={session?.user?.image ?? undefined}
                width={32}
                height={32}
                className={
                  'rounded-full bg-rad-black-500 font-bold text-lg'
                }
                onClick={() => {
                  signOut();
                }}
              />
              <span className='px-2 font-semibold'>
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

