import classNames from 'classnames';
import React from 'react';
import CustomImage from '../CustomImage';

const Message: React.FC<{
  username: string;
  image: string | undefined;
  text: string;
  createdAt: Date;
  classNames?: string;
}> = ({ createdAt, image, text, username, classNames: classNamesProp }) => {
  return (
    <div
      className={classNames(
        'flex flex-row items-start justify-start w-full h-fit py-2',
        classNamesProp
      )}
    >
      <div className='px-2'>
        <CustomImage
          name={username}
          src={image}
          width={36}
          height={36}
          className={'rounded-full bg-rad-black-500 font-bold text-lg'}
        />
      </div>
      <div className='flex flex-col'>
        <div className='flex flex-row gap-x-2 items-start text-start justify-start'>
          <span className='font-bold '>{username}</span>
          <span className='italic text-rad-light-400/30 text-sm'>
            {createdAt.toLocaleDateString()}
          </span>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Message;

