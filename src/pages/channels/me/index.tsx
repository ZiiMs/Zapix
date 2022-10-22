import CustomImage from '@/components/CustomImage';
import Layout from '@/components/layout';
import Header from '@/components/layout/header';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import classNames from 'classnames';
import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import useTitleStore from 'src/stores/titleStore';
import { set } from 'zod';
import shallow from 'zustand/shallow';

enum CategoryFilter {
  All,
  Pending,
  Sent,
}

const Me: NextPageWithLayout = () => {
  const [selected, setSelected] = useState<CategoryFilter>(CategoryFilter.All);
  const client = trpc.useContext();
  const { data: FriendRequests } = trpc.useQuery([
    'user.friends.requests.getAll',
  ]);

  const { data: SentFriendRequests } = trpc.useQuery([
    'user.friends.requests.getSent',
  ]);

  const { data: Friends } = trpc.useQuery(['user.friends.getAll']);

  const { mutate: AcceptFriend, status: AcceptingStatus } = trpc.useMutation(
    ['user.friends.requests.accept'],
    {
      onSuccess: (data) => {
        client.invalidateQueries(['user.friends.getAll']);
        client.invalidateQueries(['user.friends.requests.getAll']);
        console.log('Accepted Friend', data);
      },
    }
  );

  const { mutate: DeclineFriend, status: DeclineStatus } = trpc.useMutation(
    ['user.friends.requests.decline'],
    {
      onSuccess: (data) => {
        client.invalidateQueries(['user.friends.requests.getAll']);
        console.log('Declined Friend', data);
      },
    }
  );
  const { setTitle } = useTitleStore(
    (state) => ({ setTitle: state.setTitle }),
    shallow
  );

  const disabled = AcceptingStatus === 'loading' || DeclineStatus === 'loading';

  const getSelected = () => {
    switch (selected) {
      case CategoryFilter.All: {
        if (!Friends) break;
        return Friends.map((friend) => (
          <Link
            key={friend.id}
            href={`/channels/me/${encodeURIComponent(friend.id)}`}
          >
            <div
              className='bg-rad-black-400 hover:cursor-pointer p-2 items-center justify-between text-start w-full rounded flex flex-row'
              key={friend.id}
              onClick={(e) => {
                setTitle(friend.Friend.username ?? '');
              }}
            >
              <div className='flex flex-row'>
                <CustomImage
                  src={friend.Friend.image ?? undefined}
                  width={32}
                  height={32}
                  name={friend.Friend.username ?? ''}
                  className={'rounded-full'}
                />
                <div className='text-start items-start flex h-full justify-start px-2'>
                  <span className='font-bold p-0 leading-none'>
                    {friend.Friend.username}
                  </span>
                </div>
              </div>
              <div className='flex flex-row gap-2'>
                <button
                  className='rounded bg-rad-black-700 px-2 py-1 hover:text-rad-light-100'
                  disabled={disabled}
                  onClick={(e) => {
                    setTitle(friend.Friend.username ?? '');
                    console.log('Add FriendsRequest');
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
                      d='M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97-1.94.284-3.916.455-5.922.505a.39.39 0 00-.266.112L8.78 21.53A.75.75 0 017.5 21v-3.955a48.842 48.842 0 01-2.652-.316c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <button
                  className='rounded bg-rad-black-700 px-2 py-1 hover:text-rad-light-100'
                  disabled={disabled}
                  onClick={(e) => {
                    e.preventDefault();
                    console.log('Decline FriendsRequest');
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
                      d='M10.5 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zm0 6a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </div>
            </div>
          </Link>
        ));
      }
      case CategoryFilter.Pending: {
        if (!FriendRequests) break;
        return FriendRequests.FriendRequests.map((fr) => (
          <div
            className='bg-rad-black-400  p-2 items-center justify-between text-start w-full rounded flex flex-row'
            key={fr.id}
          >
            <div className='flex flex-row'>
              <CustomImage
                src={fr.image ?? undefined}
                width={32}
                height={32}
                name={fr.username ?? ''}
                className={'rounded-full'}
              />
              <div className='text-start items-start flex h-full justify-start px-2'>
                <span className='font-bold p-0 leading-none'>
                  {fr.username}
                </span>
              </div>
            </div>
            <div className='flex flex-row gap-2'>
              <button
                className='rounded bg-rad-black-700 px-2 py-1 hover:text-rad-light-100'
                disabled={disabled}
                onClick={(e) => {
                  e.preventDefault();
                  AcceptFriend({ id: fr.id });
                  console.log('Add FriendsRequest');
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
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
              <button
                className='rounded bg-rad-black-700 px-2 py-1 hover:text-rad-light-100'
                disabled={disabled}
                onClick={(e) => {
                  e.preventDefault();
                  DeclineFriend({ id: fr.id });
                  console.log('Decline FriendsRequest');
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
                    d='M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z'
                    clipRule='evenodd'
                  />
                </svg>
              </button>
            </div>
          </div>
        ));
      }
      case CategoryFilter.Sent: {
        if (!SentFriendRequests) break;
        return SentFriendRequests.SentFriendRequets.map((fr) => (
          <div
            className='bg-rad-black-400 p-2 items-center justify-between text-start w-full rounded flex flex-row'
            key={fr.id}
          >
            <div className='flex flex-row'>
              <CustomImage
                src={fr.image ?? undefined}
                width={32}
                height={32}
                name={fr.username ?? ''}
                className={'rounded-full'}
              />
              <div className='text-start items-start flex h-full justify-start px-2'>
                <span className='font-bold p-0 leading-none'>
                  {fr.username}
                </span>
              </div>
            </div>
          </div>
        ));
      }
      default: {
        return null;
      }
    }
  };

  return (
    <div className='w-full h-full flex flex-col'>
      <div className='w-full flex flex-row gap-2 items-center bg-rad-black-600 border-b-2 border-rad-black-700  p-3'>
        <div className='flex flex-row gap-2 border-r-2 pr-4 border-rad-black-700'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path d='M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z' />
          </svg>
          <span className='font-bold'>Friends</span>
        </div>
        <button
          className={classNames(
            'px-2 hover:bg-rad-black-700 rounded',
            selected === CategoryFilter.All
              ? 'bg-rad-black-800'
              : 'bg-transparent'
          )}
          onClick={(e) => {
            e.preventDefault();
            setSelected(CategoryFilter.All);
          }}
        >
          All
        </button>
        <button
          className={classNames(
            'px-2 hover:bg-rad-black-700 relative rounded',
            selected === CategoryFilter.Pending
              ? 'bg-rad-black-800'
              : 'bg-transparent'
          )}
          onClick={(e) => {
            e.preventDefault();
            setSelected(CategoryFilter.Pending);
          }}
        >
          {FriendRequests && FriendRequests.FriendRequests.length > 0 ? (
            <div className='absolute -top-[2px] -right-[2px] bg-red-500 p-1 rounded-full'></div>
          ) : null}
          Pending
        </button>
        <button
          className={classNames(
            'px-2 hover:bg-rad-black-700 rounded',
            selected === CategoryFilter.Sent
              ? 'bg-rad-black-800'
              : 'bg-transparent'
          )}
          onClick={(e) => {
            e.preventDefault();
            setSelected(CategoryFilter.Sent);
          }}
        >
          Sent
        </button>
      </div>
      <div className='p-2 overflow-y-auto overflow-x-hidden'>
        {getSelected()}
      </div>
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <Navbar />
      <LayoutWrapper>{page}</LayoutWrapper>
    </Layout>
  );
};

Me.getLayout = getLayout;
export default Me;

