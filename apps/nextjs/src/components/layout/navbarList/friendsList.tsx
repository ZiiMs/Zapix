import classNames from 'classnames';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import useTitleStore from 'src/stores/titleStore';
import { shallow } from 'zustand/shallow';
import CustomImage from '~/components/CustomImage';
import AddFriendModal from '~/components/modal/AddFriend';
import { api } from '~/utils/api';

const FriendsList: React.FC = () => {
  const { data: Friends } = api.friends.getAll.useQuery();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  const { setTitle } = useTitleStore(
    (state) => ({ setTitle: state.setTitle }),
    shallow
  );

  return (
    <>
      <div className='h-full p-2 space-y-2'>
        <button
          className='w-full p-2 items-center flex space-x-2 text-sm bg-rad-black-600 rounded-md text-center'
          onClick={(e) => {
            e.preventDefault();
            console.log('Add New Friends');
            setOpenModal(true);
          }}
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 20 20'
            fill='currentColor'
            className='w-5 h-5'
          >
            <path d='M11 5a3 3 0 11-6 0 3 3 0 016 0zM2.615 16.428a1.224 1.224 0 01-.569-1.175 6.002 6.002 0 0111.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 018 18a9.953 9.953 0 01-5.385-1.572zM16.25 5.75a.75.75 0 00-1.5 0v2h-2a.75.75 0 000 1.5h2v2a.75.75 0 001.5 0v-2h2a.75.75 0 000-1.5h-2v-2z' />
          </svg>
          <span>Add New Friend</span>
        </button>
        <Link href={'/channels/me'}>
          <button
            className='w-full p-2 flex space-x-2 font-bold bg-rad-black-400 rounded-md text-start'
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
              <path
                fillRule='evenodd'
                d='M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z'
                clipRule='evenodd'
              />
              <path d='M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z' />
            </svg>
            <span>Friends</span>
          </button>
        </Link>
        <hr className='w-full mt-2 border-rad-black-500' />
        {Friends ? (
          Friends.map((friend) => (
            <Link
              key={friend.id}
              href={`/channels/me/${encodeURIComponent(friend.id)}`}
            >
              <button
                className={classNames(
                  'gap-x-2  rounded w-full p-2 flex flex-row items-center',
                  friend.id === (router.query.friend as string)
                    ? 'bg-rad-black-500'
                    : 'bg-rad-black-700 hover:bg-rad-black-500/75'
                )}
                onClick={() => {
                  setTitle(friend.Friend.username ?? '');
                }}
              >
                <CustomImage
                  name={friend.Friend.username ?? ''}
                  width={32}
                  height={32}
                  src={friend.Friend.image ?? undefined}
                  className={
                    'rounded-full w-[2rem] h-[2rem] bg-rad-black-500 font-bold text-lg'
                  }
                />
                {friend.Friend.username}
              </button>
            </Link>
          ))
        ) : (
          <span>You have no friends!</span>
        )}
      </div>
      <AddFriendModal isOpen={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
};

export default FriendsList;

