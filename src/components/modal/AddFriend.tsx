import { trpc } from '@/utils/trpc';
import classNames from 'classnames';
import React, { useState } from 'react';
import Modal from '.';

const AddFriendModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [friendName, setFriendName] = useState('');

  const client = trpc.useContext();
  const { mutate: addFriend, isLoading: isAdding } = trpc.useMutation(
    ['user.friend.add'],
    {
      onSuccess: (data) => {
        client.invalidateQueries(['user.friends.getAll']);
        console.log(data);
        setFriendName('');
        onClose();
      },
    }
  );

  const isDisabled = isAdding ? true : false;

  const header = (
    <div className='flex flex-row h-full w-full items-center justify-center'>
      <div className='flex flex-row gap-2'>
        <span className='text-lg font-bold'>Add new Friend</span>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-2 w-full max-w-lg space-y-4'>
        {header}
        <div className='w-full '>
          <div className='flex flex-col gap-2'>
            <input
              className='bg-transparent hover:outline-rad-black-400 outline-rad-black-600 placeholder:text-sm outline-2 placeholder:italic placeholder:text-rad-light-300/30 outline p-1 rounded'
              value={friendName}
              onChange={(e) => {
                e.preventDefault();
                setFriendName(e.currentTarget.value);
              }}
              placeholder='Friends Name'
            />
          </div>
        </div>
        <div className='flex flex-row justify-between'>

          <button
            className='bg-rad-black-600 w-full font-semibold rounded py-2 px-3 first-letter:uppercase'
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              console.log('Creating');
              addFriend({ username: friendName });
            }}
          >
            Add Friend
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AddFriendModal;

