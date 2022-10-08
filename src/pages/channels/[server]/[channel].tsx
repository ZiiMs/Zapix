import Layout from '@/components/layout';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement } from 'react';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query;
  if (server === 'me') {
    const friendId = channel as string;
    const { data: Friend } = trpc.useQuery([
      'user.friends.get',
      { friend: friendId },
    ]);

    return (
      <div>
        {Friend?.Messages.map((message) => (
          <div key={message.id}>
            <span>{message.text}</span>
          </div>
        ))}
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

