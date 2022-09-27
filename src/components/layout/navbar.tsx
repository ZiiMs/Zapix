import { signOut } from 'next-auth/react';
import React, { useState } from 'react';
import { trpc } from '../../utils/trpc';
import CustomImage from '../CustomImage';
import CreateServerModal from '../modal/CreateServer';

const Navbar: React.FC = () => {
  const [openModal, setOpenModal] = useState(false);
  const { data } = trpc.useQuery(['server.get.all']);

  return (
    <nav className='flex flex-row w-full max-w-xs navbar'>
      <div className='h-screen p-2 w-full bg-rad-black-800 max-w-[4rem] items-center flex flex-col'>
        <button className='rounded-full hover:animate-roundedOn bg-rad-black-500 p-2 flex w-[44px] h-[44px] items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-6 h-6'
          >
            <path d='M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z' />
          </svg>
        </button>
        <hr className='w-full mt-2 border-rad-black-500' />
        <div className='flex flex-col mt-2 space-y-2'>
          {data
            ? data.map((server) => (
                <CustomImage
                  key={server.id}
                  name={server.name}
                  width={'44px'}
                  height={'44px'}
                  src={server.image ?? undefined}
                  className={'rounded-full bg-rad-black-500 font-bold text-lg'}
                />
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
      <div className={'h-screen w-60 bg-rad-black-700 p-2'}>
        <button
          className='w-full p-2 bg-rad-black-400 rounded-md text-start'
          onClick={() => {
            signOut();
          }}
        >
          Test
        </button>
      </div>
      <CreateServerModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      />
    </nav>
  );
};

export default Navbar;

