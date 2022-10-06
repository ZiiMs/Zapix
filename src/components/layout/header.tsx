import React, { TimeHTMLAttributes } from 'react';

const Header: React.FC<{ title: string }> = ({ title }) => {
  return (
    <div className='bg-rad-black-600 max-h-16 h-full flex flex-col justify-center w-full border-b-[1px] overflow-y-hidden border-rad-black-800'>
      <h1 className='font-bold text-xl p-2'>{title}</h1>
    </div>
  );
};

export default Header;

