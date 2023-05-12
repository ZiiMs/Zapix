/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
} from "react";
import { useRouter } from "next/router";
import useTitleStore from "src/stores/titleStore";

import { type Messages, type User } from "@acme/db";

import { api } from "~/utils/api";
import Message from "~/components/Message";
import Input from "~/components/input";
import Layout from "~/components/layout";
import Header from "~/components/layout/header";
import LayoutWrapper from "~/components/layout/layoutWrapper";
import Navbar, { Types } from "~/components/layout/navbar";
import { env } from "~/env.mjs";
import { type NextPageWithLayout } from "~/pages/_app";

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const [input, setInput] = useState("");
  const wss = useRef<WebSocket | null>(null);
  const { server, channel } = router.query;
  const scrollTargetRef = useRef<HTMLDivElement>(null);

  const { data: Channel } = api.channel.get.useQuery(
    { id: channel as string },
    {
      onError: (e) => {
        console.error(e);
        void router.push("/channel/me");
      },
    },
  );

  const { mutate } = api.channel.create.useMutation({
    onSuccess: () => {
      setInput("");
      console.log("Mutate success");
      scrollToBottomOfList("auto");
    },
  });

  const postQuery = api.channel["messages.getInfinite"].useInfiniteQuery(
    { limit: 20, id: channel as string },
    {
      getPreviousPageParam: (d) => d.nextCursor,
    },
  );

  const { hasPreviousPage, fetchPreviousPage, isFetchingPreviousPage } =
    postQuery;

  const setTitle = useTitleStore.use.setTitle();
  const title = useTitleStore.use.title();

  // useMemo(() => {
  //   setTitle(Channel?.name ?? "");
  // }, [Channel]);

  const [msgs, setMsgs] = useState(() => {
    const post = postQuery.data?.pages.map((page) => page.items).flat();
    return post;
  });
  type MSG = NonNullable<typeof msgs>[number];

  const scrollToBottomOfList = useCallback(
    (behavior: ScrollBehavior) => {
      if (scrollTargetRef.current == null) {
        console.log("NoRef");
        return;
      }

      scrollTargetRef.current.scrollIntoView({
        behavior: behavior,
        block: "end",
      });
    },
    [scrollTargetRef],
  );

  const addDMS = useCallback((incoming: MSG[]) => {
    setMsgs((curr) => {
      const map: Record<MSG["id"], MSG> = {};
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
  }, []);

  useEffect(() => {
    wss.current = new WebSocket(env.NEXT_PUBLIC_WS_HOST);
    wss.current.onopen = () => console.log("WS Opened");
    wss.current.onclose = () => console.log("WS Closed");

    const wsCurrent = wss.current;

    return () => {
      wsCurrent.close();
    };
  }, [wss]);

  type admsg = { channel: string; data: any };

  useEffect(() => {
    if (!wss.current) return;

    wss.current.onmessage = (e) => {
      const message: admsg = JSON.parse(e.data);
      console.log("E!", e);
      if (message.channel === "addMessage") {
        const data: Messages & { User: User } = message.data.message;
        if (data.channelsId === (channel as string)) {
          console.log("FoundData", data);
          addDMS([data]);
        }
      }
    };
  }, []);

  useEffect(() => {
    const msgs = postQuery.data?.pages.map((page) => page.items).flat();
    if (msgs !== undefined) {
      setMsgs([]);
      addDMS(msgs);
      scrollToBottomOfList("auto");
    }
  }, [postQuery.data?.pages, addDMS]);

  // api.channel.onAdd.useSubscription(
  //   { channelId: channel as string },
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
        className="flex w-full flex-col gap-2 overflow-y-auto scrollbar-thin scrollbar-track-rad-black-200 scrollbar-thumb-rad-black-900 scrollbar-track-rounded scrollbar-thumb-rounded"
        onScroll={(e) => {
          const bottom = e.currentTarget.scrollTop <= 200;

          if (bottom && hasPreviousPage && !isFetchingPreviousPage) {
            void fetchPreviousPage();
          }
        }}
      >
        {msgs?.map((msg, i) => (
          <Message
            key={msg.id}
            classNames={
              i % 2 === 1 ? "bg-rad-black-700/50" : "bg-rad-black-600"
            }
            createdAt={msg.createdAt}
            image={msg.User.image ?? undefined}
            text={msg.body}
            username={msg.User.username ?? ""}
          />
        ))}
        <div ref={scrollTargetRef}></div>
      </div>
      <div className="w-full px-2 pb-2">
        <div className="flex w-full flex-row rounded bg-rad-black-300 p-2">
          <Input
            className="w-full bg-transparent p-1 outline-none placeholder:text-rad-light-600 placeholder:opacity-50 "
            placeholder={`Message #${Channel?.name}`}
            onChange={(e) => {
              setInput(e.currentTarget.value);
            }}
            value={input}
            onSubmit={() => {
              console.log(input.trim().length);
              if (input.trim().length !== 0) {
                mutate({
                  body: input,
                  channelId: channel as string,
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
      <Navbar type={Types.Channels} />
      <Header>
        <LayoutWrapper>{page}</LayoutWrapper>
      </Header>
    </Layout>
  );
};

Channel.getLayout = getLayout;
export default Channel;
