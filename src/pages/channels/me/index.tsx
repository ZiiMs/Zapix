import CustomImage from '@/components/CustomImage';
import Layout from '@/components/layout';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import React, { ReactElement } from 'react';

const Me: NextPageWithLayout = () => {
  const client = trpc.useContext();
  const { data: FriendRequests } = trpc.useQuery([
    'user.friends.requests.getAll',
  ]);

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

  const disabled = AcceptingStatus === 'loading' || DeclineStatus === 'loading';

  return (
    <div className='w-full h-full flex flex-col p-2 overflow-y-auto overflow-x-hidden'>
      {FriendRequests
        ? FriendRequests.FriendRequests.map((fr) => (
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
          ))
        : null}
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

