import React, { useState } from "react";

import { type Channels } from "@zapix/db";

import { api } from "~/utils/api";
// import Input from '../input';
import Input from "~/components/input";
import Modal from ".";

const EditChannelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channel: Channels;
  serverId: string;
}> = ({ isOpen, onClose, channel, serverId }) => {
  const [channelName, setChannelName] = useState(channel.name);
  const [isPrivate, setIsPrivate] = useState(channel.private);
  const [channelId] = useState(channel.id);

  const client = api.useContext();
  const { mutate: updateChannel, isLoading: isUpdating } =
    api.channel.update.useMutation({
      onSuccess: async (data) => {
        await client.server.get.invalidate({
          id: serverId,
        });
        console.log(data);
        setChannelName("");
        onClose();
      },
    });

  const isDisabled = isUpdating ? true : false;

  const header = (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <div className="flex flex-row gap-2">
        <span className="text-lg font-bold">Editing</span>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex w-full max-w-lg flex-col space-y-4 p-2">
        {header}
        <div className="w-full ">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 font-semibold">
              Channel Name
              <Input
                className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 placeholder:text-sm placeholder:italic placeholder:text-rad-light-300/30 hover:outline-rad-black-400"
                value={channelName}
                onSubmit={() => {
                  updateChannel({
                    channelId: channelId,
                    private: isPrivate,
                    title: channelName,
                  });
                }}
                onChange={(e) => {
                  e.preventDefault();
                  setChannelName(e.currentTarget.value);
                }}
                placeholder="new channel"
              />
            </label>
            <label className="flex items-center justify-between font-semibold">
              Private Channel
              <label className="relative inline-flex">
                <input
                  type="checkbox"
                  checked={isPrivate}
                  className="peer sr-only"
                  onChange={(e) => e.preventDefault()}
                />
                <div
                  onClick={() => {
                    setIsPrivate(!isPrivate);
                    console.log("Clicked", isPrivate);
                  }}
                  className="h-6 w-11 cursor-pointer rounded-full bg-rad-black-100 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-500 peer-checked:after:translate-x-full"
                ></div>
              </label>
            </label>
          </div>
        </div>
        <div className="flex w-full flex-row gap-2">
          <button
            className="flex w-fit items-center justify-center rounded px-2 font-semibold first-letter:uppercase disabled:text-rad-black-500"
            disabled={
              channelName === channel.name && isPrivate === channel.private
                ? true
                : false
            }
            onClick={(e) => {
              e.preventDefault();
              close();
              console.log("Creating");
            }}
          >
            reset
          </button>

          <button
            className="flex w-full items-center justify-center rounded bg-rad-black-600 px-3 py-2 font-semibold first-letter:uppercase"
            // disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              console.log("Creating");
              updateChannel({
                channelId: channelId,
                private: isPrivate,
                title: channelName,
              });
            }}
          >
            Save Changes
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditChannelModal;
