import DirectMessages from '@/components/DirectMessages';
import Layout from '@/components/layout';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query;
  const [message, setMessage] = useState('');
  if (server === 'me') {
    const friendId = channel as string;
    const { data: Friend } = trpc.useQuery([
      'user.friends.get',
      { friend: friendId },
    ]);

    const { mutate } = trpc.useMutation(['dm.create'], {
      onSuccess: (data) => {
        setMessage('');
        console.log('Mutate success');
      },
    });
    return (
      <div className='flex w-full h-full flex-col items-start justify-end p-2'>
        {Friend?.Messages.map((message) => (
          <DirectMessages key={message.id} Message={message} />
        ))}
        <div className='flex flex-row p-2 bg-rad-black-300 w-full rounded'>
          <input
            className='bg-transparent p-1 w-full outline-none'
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
            onSubmit={() => {
              console.log('Submitted?');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                mutate({
                  reciever: channel ? (channel as string) : '',
                  text: message,
                });
              }
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      Channel:{channel}Server:{server}
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

Channel.getLayout = getLayout;
export default Channel;

