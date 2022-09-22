import React from 'react';
import CustomImage from '../CustomImage';

const Navbar: React.FC = () => {
  return (
    <nav className='flex flex-row w-full max-w-xs navbar'>
      <div className='h-screen p-2 w-full bg-main-black-800 max-w-[4rem] items-center flex flex-col'>
        <button className='rounded-full bg-main-black-500 p-2 flex w-[44px] h-[44px] items-center justify-center'>
          Test
        </button>
        <hr className='w-full mt-2 bg-main-black-500 text-main-black-500 border-main-black-500' />
        <div className='flex flex-col mt-2 space-y-2'>
          <CustomImage
            name={'Test Test'}
            width={'44px'}
            height={'44px'}
            className={'rounded-full bg-main-black-500 font-bold text-lg'}
          />{' '}
          <CustomImage
            name={'Test Test'}
            src={
              'https://images.unsplash.com/photo-1660216140102-c25afd109129?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=699&q=80'
            }
            layout={'fill'}
            className={'rounded-full bg-main-black-500 font-bold text-lg'}
          />
        </div>
        <div></div>
      </div>
      <div className={'h-screen w-60 bg-main-black-700 p-2'}>
        <button className='w-full p-2 bg-main-black-400 rounded-md text-start'>
          Test
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

