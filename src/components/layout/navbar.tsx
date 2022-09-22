import React from 'react';

const Navbar: React.FC = () => {
  return (
    <nav className='flex flex-row w-full max-w-xs navbar'>
      <div className='h-screen p-2 w-full bg-main-black-800 max-w-[4rem] items-center flex flex-col'>
        <button className='p-2 rounded-full bg-main-black-500 w-[44px] h-[44px]'>
          Test
        </button>
        <hr className='w-full mt-2 bg-main-black-500 text-main-black-500 border-main-black-500' />
        <div className='flex flex-col mt-2 space-y-2'></div>
      </div>
    </nav>
  );
};

export default Navbar;

