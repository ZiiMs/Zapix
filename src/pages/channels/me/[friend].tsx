import DirectMessages from '@/components/DirectMessages';
import Input from '@/components/input';
import Layout from '@/components/layout';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar from '@/components/layout/navbar';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';

const Friend: NextPageWithLayout = () => {
  const router = useRouter();
  const { friend } = router.query;
  const [message, setMessage] = useState('');
  const { data: session, status } = useSession();
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const channelId = friend as string;

  const { mutate } = trpc.useMutation(['dm.create'], {
    onSuccess: (data) => {
      setMessage('');
      console.log('Mutate success');
    },
  });

  const scrolled = false;

  const postQuery = trpc.useInfiniteQuery(
    ['dm.infiniteDms', { limit: 20, friendId: channelId }],
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

      return Object.values(map).sort(
        (a, b) => a.createdAt.getTime() - b.createdAt.getTime()
      );
    });
    scrollToBottomOfList('auto');
  }, []);

  // useEffect(() => {
  //   scrollToBottomOfList('auto');
  // }, []);

  useEffect(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    console.log(msgs);
    if (msgs !== undefined) {
      setDms([]);
      addDMS(msgs);
    }
  }, [postQuery.data?.pages, addDMS]);

  useEffect(() => {
    scrollToBottomOfList('auto');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dms]);

  const scrollToBottomOfList = useCallback(
    (behavior: ScrollBehavior) => {
      if (scrollTargetRef.current == null) {
        return;
      }

      scrollTargetRef.current.scrollIntoView({
        behavior: behavior,
        block: 'end',
      });
    },
    [scrollTargetRef]
  );

  if (!session || !session.user) return <div>Session ont found!</div>;

  trpc.useSubscription(['dm.onAdd', { channelId: channelId }], {
    onNext: (data) => {
      addDMS([data]);
      console.log('FoundData', data);
    },
  });

  return (
    <div className='flex w-full h-full flex-col items-start justify-end '>
      <div
        className='pl-2 overflow-y-auto flex flex-col w-full scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900'
        onScroll={(e) => {
          const bottom = e.currentTarget.scrollTop <= 200;

          if (bottom && hasPreviousPage && !isFetchingPreviousPage) {
            fetchPreviousPage();
          }
        }}
      >
        {dms?.map((dm) => (
          <DirectMessages key={dm.id} Message={dm} />
        ))}
        <div ref={scrollTargetRef}></div>
      </div>
      <div className='px-2 pb-2 w-full'>
        <div className='flex flex-row p-2 bg-rad-black-300 w-full rounded'>
          <Input
            className='bg-transparent p-1 w-full outline-none'
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
            value={message}
            onSubmit={() => {
              mutate({
                reciever: friend as string,
                text: message,
                channelId: channelId,
              });
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

