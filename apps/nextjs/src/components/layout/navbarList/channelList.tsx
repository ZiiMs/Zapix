import React, {useMemo, useRef, useState} from "react";
import Link from "next/link";
import {useRouter} from "next/router";
import classNames from "classnames";
import useTitleStore from "src/stores/titleStore";

import {api} from "~/utils/api";
import ContextMenu from "~/components/contextMenu";
import CreateChannelModal from "~/components/modal/CreateChannel";

const ChannelList: React.FC = () => {
    const router = useRouter();
    const {server, channel} = router.query;
    const {data: Server} = api.server.get.useQuery({id: server as string});
    const chanBackgroundRef = useRef<HTMLDivElement | null>(null);
    const [createChannel, setCreateChannel] = useState(false);
    const Channels = Server?.Channels;

    const [menuInfo, setMenuInfo] = useState<{
        x: number;
        y: number;
        selected: string | null;
        showMenu: boolean;
    }>({
        x: 0,
        y: 0,
        selected: null,
        showMenu: false,
    });

    const setTitle = useTitleStore.use.setTitle();
    // const title = useTitleStore.use.title();

    useMemo(() => {
        Channels?.map((c) => {
            if (c.default) {
                void router.push(`/channels/${server}/${encodeURIComponent(c.id)}`);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!Server) {
        return <div>Loading Server</div>;
    }

    const CreateServerInvite = () => (
        <li>
            <button
                className="h-full w-full px-2 py-2 disabled:cursor-not-allowed hover:bg-rad-black-600"
                onClick={(e) => {
                    e.preventDefault();
                    setMenuInfo({...menuInfo, showMenu: false, selected: null});
                }}
            >
                Invite
            </button>
        </li>
    )

    return (
        <>
            <div id="channelBackground" className="h-full">
                <div className="flex border-b border-rad-black-900">
                    <button className="flex w-full items-center space-x-2 bg-rad-light-900 p-4 font-bold">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z"
                                clipRule="evenodd"
                            />
                            <path
                                d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z"/>
                        </svg>
                        <span>{Server.name}</span>
                    </button>
                </div>
                <div
                    id="ChannelListBackground"
                    className="h-full space-y-2"
                    ref={chanBackgroundRef}
                    onContextMenu={(e) => {
                        if (e.target == chanBackgroundRef.current) {
                            console.log("True");
                            e.preventDefault();
                            setMenuInfo({
                                showMenu: true,
                                x: e.pageX,
                                y: e.pageY,
                                selected: null,
                            });
                        }
                    }}
                >
                    {Channels
                        ? Channels.map((Channel) => {
                            return (
                                <Link
                                    key={Channel.id}
                                    href={`/channels/${server}/${encodeURIComponent(
                                        Channel.id,
                                    )}`}
                                    className=" flex px-2 first:pt-2"
                                >
                                    <button
                                        id={"ChannelButton"}
                                        className={classNames(
                                            "flex  w-full flex-row items-center gap-x-2 rounded p-2",
                                            Channel.id === channel
                                                ? "bg-rad-black-500"
                                                : "bg-rad-black-700 hover:bg-rad-black-500/75",
                                        )}
                                        onClick={() => {
                                            setTitle(Channel.name ?? "");
                                        }}
                                        onContextMenu={(e) => {
                                            e.preventDefault();
                                            setMenuInfo({
                                                showMenu: true,
                                                x: e.pageX,
                                                y: e.pageY,
                                                selected: Channel.id,
                                            });
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="h-6 w-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z"
                                                clipRule="evenodd"
                                            />
                                        </svg>

                                        {Channel.name}
                                    </button>
                                </Link>
                            );
                        })
                        : null}
                </div>
            </div>
            <ContextMenu
                toggleMenu={() =>
                    setMenuInfo({...menuInfo, showMenu: false, selected: null})
                }
                showMenu={menuInfo.showMenu}
                x={menuInfo.x}
                y={menuInfo.y}
            >
                {menuInfo.selected ? (
                    <ul className="divide cursor-pointer select-none divide-y-[1px] divide-rad-black-300 p-0">
                        <li>
                            <button
                                className="h-full w-full px-2 py-2 disabled:cursor-not-allowed hover:bg-rad-black-600"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (menuInfo.selected === null) {
                                        return;
                                    }

                                    setMenuInfo({...menuInfo, showMenu: false, selected: null});
                                    console.log("Edit");
                                }}
                            >
                                Edit
                            </button>
                        </li>
                        <li>
                            <button
                                className="h-full w-full px-2 py-2 disabled:cursor-not-allowed disabled:bg-transparent hover:bg-rad-black-600"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (menuInfo.selected === null) {
                                        return;
                                    }

                                    setMenuInfo({...menuInfo, showMenu: false, selected: null});
                                    console.log("Delete");
                                }}
                            >
                                Delete
                            </button>
                        </li>
                    </ul>
                ) : (
                    <ul className="divide cursor-pointer select-none divide-y-[1px] divide-rad-black-300 p-0">
                        <li>
                            <button
                                className="h-full w-full px-2 py-2 disabled:cursor-not-allowed hover:bg-rad-black-600"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (menuInfo.selected === null) {
                                        return;
                                    }
                                    setMenuInfo({...menuInfo, showMenu: false, selected: null});
                                    setCreateChannel(true);
                                }}
                            >
                                Create
                            </button>
                        </li>
                        <CreateServerInvite/>
                    </ul>
                )}
            </ContextMenu>
            <CreateChannelModal
                isOpen={createChannel}
                onClose={() => {
                    setCreateChannel(false);
                }}
                serverId={Server.id}
            ></CreateChannelModal>
        </>
    );
};


export default ChannelList;
