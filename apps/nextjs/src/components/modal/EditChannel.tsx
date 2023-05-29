import React, { useState } from "react";

import { api } from "~/utils/api";
// import Input from '../input';
import Input from "~/components/input";
import Modal from ".";

const EditChannelModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
}> = ({ isOpen, onClose, channelId }) => {
  const [channelName, setChannelName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const client = api.useContext();
  const { mutate: createChannel, isLoading: isCreating } =
    api.channel.create.useMutation({
      onSuccess: async (data) => {
        await client.server.get.invalidate({
          id: serverId,
        });
        console.log(data);
        setChannelName("");
        onClose();
      },
    });

  const isDisabled = isCreating ? true : false;

  const header = (
    <div className="flex h-full w-full flex-row items-center justify-center">
      <div className="flex flex-row gap-2">
        <span className="text-lg font-bold">Create</span>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-lg space-y-4 p-2">
        {header}
        <div className="w-full ">
          <div className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 font-semibold">
              Channel Name
              <Input
                className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 placeholder:text-sm placeholder:italic placeholder:text-rad-light-300/30 hover:outline-rad-black-400"
                value={channelName}
                onSubmit={() => {
                  createChannel({
                    serverId,
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
        <div className="flex flex-row justify-between">
          <button
            className="w-full rounded bg-rad-black-600 px-3 py-2 font-semibold first-letter:uppercase"
            disabled={isDisabled}
            onClick={(e) => {
              e.preventDefault();
              console.log("Creating");
              createChannel({
                serverId,
                private: isPrivate,
                title: channelName,
              });
            }}
          >
            Create Channel
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default EditChannelModal;
