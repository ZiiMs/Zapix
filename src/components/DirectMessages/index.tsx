import { DirectMessages, User } from '@prisma/client';
import React from 'react';
import CustomImage from '../CustomImage';

const DirectMessages: React.FC<{
  Message: DirectMessages & {
    Sender: User;
  };
}> = ({ Message }) => {
  return (
    <div className='flex flex-row items-start justify-start w-full h-fit py-2'>
      <div className='px-2'>
        <CustomImage
          name={Message.Sender.username ?? ''}
          src={Message.Sender.image ?? undefined}
          width={40}
          height={40}
          className={
            'rounded-full  bg-rad-black-500 font-bold text-lg'
          }
        />
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row gap-x-2 items-start text-start justify-start'>
          <span className='font-bold '>{Message.Sender.username}</span>
          <span className='italic text-rad-light-400/30 text-sm'>
            {Message.createdAt.toLocaleDateString()}
          </span>
        </div>{' '}
        <span>{Message.text}</span>
      </div>
    </div>
  );
};

export default DirectMessages;

