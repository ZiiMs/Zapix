import classNames from 'classnames';
import React, { useState } from 'react';
import Modal from '.';
import { trpc } from '../../utils/trpc';

const CreateServerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [stepper, setSteps] = useState(1);
  const [selected, setSelected] = useState<'join' | 'create'>('join');
  const [serverData, setServerData] = useState<{ image: string; name: string }>(
    { image: '', name: '' }
  );

  const client = trpc.useContext();
  const { mutate: createServer, isLoading: isCreating } = trpc.useMutation(
    ['server.create'],
    {
      onSuccess: (data) => {
        client.invalidateQueries(['server.get.all']);
        console.log(data);
        setServerData({ image: '', name: '' });
        onClose();
      },
    }
  );

  const { mutate: joinServer, isLoading: isJoining } = trpc.useMutation(
    ['server.join'],
    {
      onSuccess: (data) => {
        client.invalidateQueries(['server.get.all']);
        console.log(data);
        setServerData({ image: '', name: '' });
        onClose();
      },
    }
  );

  const isDisabled = isCreating || isJoining ? true : false;

  const header = (
    <div className='flex flex-row h-full w-full items-center'>
      <div className='flex flex-row gap-2'>
        <div
          className={classNames(
            'select-none rounded-full w-6 h-6 flex items-center justify-center text-center',
            stepper >= 1 ? 'bg-rad-red-500' : 'bg-rad-black-300'
          )}
        >
          <span className='font-semibold'>
            {stepper > 1 ? (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
                fill='currentColor'
                className='w-5 h-5'
              >
                <path
                  fillRule='evenodd'
                  d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                  clipRule='evenodd'
                />
              </svg>
            ) : (
              '1'
            )}
          </span>
        </div>
        <span className=''>Join/Create</span>
      </div>
      <div className='p-2 w-full h-full'>
        <div
          className={classNames(
            'rounded w-full flex border',
            stepper >= 2 ? 'border-rad-red-500' : 'border-rad-black-300'
          )}
        ></div>
      </div>
      <div>
        <div className='flex flex-row gap-2'>
          <div
            className={classNames(
              'select-none rounded-full w-6 h-6 flex items-center justify-center text-center',
              stepper >= 2 ? 'bg-rad-red-500' : 'bg-rad-black-300'
            )}
          >
            <span className='font-semibold'>
              {stepper > 2 ? (
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-5 h-5'
                >
                  <path
                    fillRule='evenodd'
                    d='M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z'
                    clipRule='evenodd'
                  />
                </svg>
              ) : (
                '2'
              )}
            </span>
          </div>
          <span className='first-letter:uppercase'>{selected}</span>
        </div>
      </div>
    </div>
  );

  const join = (
    <div className='w-full'>
      <div className='flex flex-col gap-2'>
        <input
          className='bg-transparent hover:outline-rad-black-400 outline-rad-black-600 placeholder:text-sm outline-2 placeholder:italic placeholder:text-rad-light-300/30 outline p-1 rounded'
          placeholder='Code'
        />
        <label>
          Pleas enter a code above. You can find the code to a server located in
          the top left of the server. Press the button and a code will be
          generated.
        </label>
      </div>
    </div>
  );

  const create = (
    <div className='w-full '>
      <div className='flex flex-col gap-2'>
        <label className='font-semibold'>Name</label>
        <input
          className='bg-transparent hover:outline-rad-black-400 outline-rad-black-600 placeholder:text-sm outline-2 placeholder:italic placeholder:text-rad-light-300/30 outline p-1 rounded'
          value={serverData.name}
          onChange={(e) => {
            e.preventDefault();
            setServerData({ ...serverData, name: e.target.value });
          }}
          placeholder='Server name'
        />
        <label className='font-semibold'>Image</label>
        <input
          className='bg-transparent hover:outline-rad-black-400 placeholder:text-sm outline-rad-black-600 outline-2 placeholder:italic placeholder:text-rad-light-300/30 outline p-1 rounded'
          value={serverData.image}
          placeholder='Image URL (blank for none)'
          onChange={(e) => {
            e.preventDefault();
            setServerData({ ...serverData, image: e.target.value });
          }}
        />
      </div>
    </div>
  );

  const selection = (
    <div className='flex flex-col w-full p-2'>
      <div className='space-y-4'>
        <h1 className='text-3xl font-bold items-center justify-center text-center p-2'>
          Create a server.
        </h1>
        <span>
          A server is where you will be able to chat and hangout with other
          people.
        </span>
        <button
          className='w-full rounded-md p-2 outline-1 outline-rad-black-600 outline'
          onClick={(e) => {
            e.preventDefault();
            setSteps(2);
            setSelected('create');
          }}
        >
          <span>Create my own server</span>
        </button>
      </div>
      <div className='py-5'>
        <hr className='border-rad-black-300' />
      </div>
      <div>
        <h1 className='text-lg font-bold text-center pb-2'>
          Already have a code?
        </h1>
        <button
          className='w-full rounded-md p-2 bg-rad-black-600'
          onClick={(e) => {
            e.preventDefault();
            setSteps(2);
            setSelected('join');
          }}
        >
          Join a Server
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className='p-2 w-full max-w-lg min-w-[28rem] space-y-4'>
        {header}
        {stepper === 1 ? selection : <>{selected === 'join' ? join : create}</>}
        {stepper >= 2 ? (
          <div className='flex flex-row justify-between'>
            <button
              className='text-rad-black-300 font-semibold  rounded py-2 px-3 hover:bg-rad-black-600/50'
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                setSteps(1);
              }}
            >
              Back
            </button>
            <button
              className='bg-rad-black-600 font-semibold rounded py-2 px-3 first-letter:uppercase'
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                switch (selected) {
                  case 'create': {
                    console.log('Creating');
                    createServer({
                      image: serverData.image,
                      name: serverData.name,
                    });
                    break;
                  }
                  case 'join': {
                    console.log('Joing');
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }}
            >
              {selected}
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default CreateServerModal;

