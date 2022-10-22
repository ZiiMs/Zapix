import Input from '@/components/input';
import Layout from '@/components/layout';
import Header from '@/components/layout/header';
import LayoutWrapper from '@/components/layout/layoutWrapper';
import Navbar, { Types } from '@/components/layout/navbar';
import Message from '@/components/Message';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react';
import useTitleStore from 'src/stores/titleStore';
import shallow from 'zustand/shallow';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query;
  const { data: Channel } = trpc.useQuery(
    ['channel.get', { id: channel as string }],
    {
      onError: (e) => {
        console.error(e);
        router.push('/channel/me');
      },
    }
  );

  const postQuery = trpc.useInfiniteQuery(
    ['channel.messages.getInfinite', { limit: 20, id: channel as string }],
    {
      getPreviousPageParam: (d) => d.nextCursor,
    }
  );

  const { hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage } =
    postQuery;

  const { setTitle } = useTitleStore(
    (state) => ({ setTitle: state.setTitle }),
    shallow
  );

  useMemo(() => {
    setTitle(Channel?.name ?? '');
  }, []);

  const [msgs, setMsgs] = useState(() => {
    const post = postQuery.data?.pages.map((page) => page.items).flat();
    return post;
  });
  type MSG = NonNullable<typeof msgs>[number];

  const addDMS = useCallback((incoming: MSG[]) => {
    console.log('weopirj');
    setMsgs((curr) => {
      const map: Record<MSG['id'], MSG> = {};
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
  }, []);

  // useEffect(() => {
  //   scrollToBottomOfList('auto');
  // }, []);

  useEffect(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    console.log(msgs);
    if (msgs !== undefined) {
      setMsgs([]);
      addDMS(msgs);
    }
  }, [postQuery.data?.pages, addDMS]);

  return (
    <div className='flex w-full h-full flex-col items-start justify-end '>
      <div
        className='pl-2 overflow-y-auto gap-2 flex flex-col w-full scrollbar-thin scrollbar-thumb-rounded scrollbar-track-rounded scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900'
        onScroll={(e) => {
          const bottom = e.currentTarget.scrollTop <= 200;

          if (bottom && hasPreviousPage && !isFetchingPreviousPage) {
            fetchPreviousPage();
          }
        }}
      >
        {msgs?.map((msg, i) => (
          <Message
            key={msg.id}
            classNames={
              i % 2 === 1 ? 'bg-rad-black-700/50' : 'bg-rad-black-600'
            }
            createdAt={msg.createdAt}
            image={msg.User.image ?? undefined}
            text={msg.body}
            username={msg.User.username ?? ''}
          />
        ))}
        {/* <div ref={scrollTargetRef}></div> */}
      </div>
      <div className='px-2 pb-2 w-full'>
        <div className='flex flex-row p-2 bg-rad-black-300 w-full rounded'>
          <Input
            className='bg-transparent p-1 w-full outline-none'
            onSubmit={() => {
              console.log('Submited');
            }} // onChange={(e) => {
            //   setMessage(e.currentTarget.value);
            // }}
            // value={message}
            // onSubmit={() => {
            //   mutate({
            //     reciever: friend as string,
            //     text: message,
            //     channelId: channelId,
            //   });
            // }}
          />
        </div>
      </div>
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return (
    <Layout>
      <Navbar type={Types.Channels} />
      <Header>
        <LayoutWrapper>{page}</LayoutWrapper>
      </Header>
    </Layout>
  );
};

Channel.getLayout = getLayout;
export default Channel;

