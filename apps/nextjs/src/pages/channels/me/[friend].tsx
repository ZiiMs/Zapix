import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { string } from "zod";

import channel from "@zappix/api/src/router/channel";
import { type DirectMessages, type Messages, type User } from "@zappix/db";

import { api } from "~/utils/api";
import Message from "~/components/Message";
import Input from "~/components/input";
import Layout from "~/components/layout";
import Header from "~/components/layout/header";
import LayoutWrapper from "~/components/layout/layoutWrapper";
import Navbar from "~/components/layout/navbar";
import { env } from "~/env.mjs";
import { type NextPageWithLayout } from "~/pages/_app";

const Friend: NextPageWithLayout = () => {
  const router = useRouter();
  const { friend } = router.query;
  const [message, setMessage] = useState("");
  const wss = useRef<WebSocket | null>(null);
  const { data: session, status } = useSession();
  const scrollTargetRef = useRef<HTMLDivElement>(null);
  const channelId = friend as string;

  const { mutate } = api.dms.create.useMutation({
    onSuccess: (data) => {
      setMessage("");
      console.log("Mutate success");
    },
  });

  const scrolled = false;

  const postQuery = api.dms.infiniteDms.useInfiniteQuery(
    { limit: 20, friendId: channelId },
    {
      getPreviousPageParam: (d) => d.nextCursor,
    },
  );

  const { hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage } =
    postQuery;

  const [dms, setDms] = useState(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    return msgs;
  });
  type DM = NonNullable<typeof dms>[number];

  const addDMS = useCallback((incoming: DM[]) => {
    setDms((curr) => {
      const map: Record<DM["id"], DM> = {};
      for (const msg of curr ?? []) {
        map[msg.id] = msg;
      }
      for (const msg of incoming ?? []) {
        map[msg.id] = msg;
      }

      return Object.values(map).sort((a, b) => {
        if (typeof a.createdAt === "string") {
          a.createdAt = new Date(a.createdAt);
        }
        if (typeof b.createdAt === "string") {
          b.createdAt = new Date(b.createdAt);
        }

        return a.createdAt.getTime() - b.createdAt.getTime();
      });
    });
    scrollToBottomOfList("auto");
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
    scrollToBottomOfList("auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dms]);

  const scrollToBottomOfList = useCallback(
    (behavior: ScrollBehavior) => {
      if (scrollTargetRef.current == null) {
        return;
      }

      scrollTargetRef.current.scrollIntoView({
        behavior: behavior,
        block: "end",
      });
    },
    [scrollTargetRef],
  );

  useEffect(() => {
    wss.current = new WebSocket(env.NEXT_PUBLIC_WS_HOST);
    wss.current.onopen = () => console.log("WS Opened");
    wss.current.onclose = () => console.log("WS Closed");

    const wsCurrent = wss.current;

    return () => {
      wsCurrent.close();
    };
  }, [wss]);

  type adDm = {
    channel: string;
    data: {
      dm: DirectMessages & {
        Sender: User;
      };
      channelId: string;
    };
  };

  useEffect(() => {
    if (!wss.current) return;

    wss.current.onmessage = (e) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const message: adDm = JSON.parse(e.data);
      console.log("E!", message);
      if (message.channel === "addDm") {
        const data = message.data;
        if (data.channelId === channelId) {
          console.log("FoundData", data);

          addDMS([data.dm]);
        }
      }
    };
  }, []);

  if (!session || !session.user) return <div>Session ont found!</div>;

  // api.dms.onAdd.useSubscription(
  //   { channelId: channelId },
  //   {
  //     onData: (data) => {
  //       addDMS([data]);
  //       console.log("FoundData", data);
  //     },
  //   },
  // );

  return (
    <div className="flex h-full w-full flex-col items-start justify-end ">
      <div
        className="flex w-full flex-col overflow-y-auto pl-2 scrollbar-thin scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900 scrollbar-track-rounded scrollbar-thumb-rounded"
        onScroll={(e) => {
          const bottom = e.currentTarget.scrollTop <= 200;

          if (bottom && hasPreviousPage && !isFetchingPreviousPage) {
            void fetchPreviousPage();
          }
        }}
      >
        {dms?.map((dm) => (
          <Message
            key={dm.id}
            createdAt={dm.createdAt}
            image={dm.Sender.image ?? undefined}
            text={dm.text}
            username={dm.Sender.username ?? ""}
          />
        ))}
        <div ref={scrollTargetRef}></div>
      </div>
      <div className="w-full px-2 pb-2">
        <div className="flex w-full flex-row rounded bg-rad-black-300 p-2">
          <Input
            className="w-full bg-transparent p-1 outline-none"
            onChange={(e) => {
              setMessage(e.currentTarget.value);
            }}
            value={message}
            onSubmit={() => {
              if (message.trim().length !== 0) {
                mutate({
                  reciever: friend as string,
                  text: message,
                  channelId: channelId,
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
      <Header>
        <LayoutWrapper>{page}</LayoutWrapper>
      </Header>
    </Layout>
  );
};

Friend.getLayout = getLayout;
export default Friend;
