import DirectMessages from '@/components/DirectMessages';
import Layout from '@/components/layout';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement, useCallback, useEffect, useState } from 'react';

const Friend: NextPageWithLayout = () => {
  const router = useRouter();
  const { friend } = router.query;
  const [message, setMessage] = useState('');
  const friendId = friend as string;

  const { mutate } = trpc.useMutation(['dm.create'], {
    onSuccess: (data) => {
      setMessage('');
      console.log('Mutate success');
    },
  });

  const postQuery = trpc.useInfiniteQuery(
    ['dm.infiniteDms', { limit: 1, friendId: friendId }],
    {
      getPreviousPageParam: (d) => d.nextCursor,
    }
  );

  const { hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage } =
    postQuery;

  const [dms, setDms] = useState(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type DM = NonNullable<typeof dms>[number];
  const addDMS = useCallback((incoming: DM[]) => {
    console.log('weopirj');
    setDms((curr) => {
      const map: Record<DM['id'], DM> = {};
      for (const msg of curr ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }

      return Object.values(map).sort((a, b) => a.id - b.id);
    });
  }, []);

  useEffect(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    if (msgs) {
      addDMS(msgs);
    }
  }, [postQuery.data?.pages, addDMS]);

  trpc.useSubscription(['dm.onAdd', { channelId: friendId }], {
    onNext: (data) => {
      addDMS([data]);
      console.log('FoundData', data);
    },
  });

  return (
    <div className='flex w-full h-full flex-col items-start justify-end '>
      <div className='pl-2 overflow-y-auto flex flex-col w-full scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900'>
        {dms?.map((dm) => (
          <DirectMessages key={dm.id} Message={dm} />
        ))}
      </div>
      <div className='px-2 pb-2 w-full'>
        <div className='flex flex-row p-2 bg-rad-black-300 w-full rounded'>
          <input
            className='bg-transparent p-1 w-full outline-none'
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
            value={message}
            onSubmit={() => {
              console.log('Submitted?');
            }}
            onKeyDown={(e) => {
              if (message === '') return;
              if (e.key === 'Enter') {
                mutate({
                  reciever: friend as string,
                  text: message,
                  channelId: friendId,
                });
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <Navbar />
      <LayoutWrapper>{page}</LayoutWrapper>
    </Layout>
  );
};

Friend.getLayout = getLayout;
export default Friend;

