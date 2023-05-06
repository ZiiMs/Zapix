import classNames from "classnames";
import React, { useState } from "react";
import { api } from "~/utils/api";
import Modal from ".";
import Input from "../input";

const CreateServerModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [stepper, setSteps] = useState(1);
  const [selected, setSelected] = useState<"join" | "create">("join");
  const [serverCode, setServerCode] = useState<string>("");
  const [serverData, setServerData] = useState<{ image: string; name: string }>(
    { image: "", name: "" }
  );

  const client = api.useContext();
  const { mutate: createServer, isLoading: isCreating } =
    api.server.create.useMutation({
      onSuccess: async (data) => {
        await client.server.getAll.invalidate();
        console.log(data);
        setServerData({ image: "", name: "" });
        onClose();
      },
    });

  const { mutate: joinServer, isLoading: isJoining } =
    api.server.join.useMutation({
      onSuccess: async (data) => {
        await client.server.getAll.invalidate();
        console.log(data);
        onClose();
      },
    });

  const isDisabled = isCreating || isJoining ? true : false;

  const header = (
    <div className="flex h-full w-full flex-row items-center">
      <div className="flex flex-row gap-2">
        <div
          className={classNames(
            "flex h-6 w-6 select-none items-center justify-center rounded-full text-center",
            stepper >= 1 ? "bg-rad-red-500" : "bg-rad-black-300"
          )}
        >
          <span className="font-semibold">
            {stepper > 1 ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path
                  fillRule="evenodd"
                  d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              "1"
            )}
          </span>
        </div>
        <span className="">Join/Create</span>
      </div>
      <div className="h-full w-full p-2">
        <div
          className={classNames(
            "flex w-full rounded border",
            stepper >= 2 ? "border-rad-red-500" : "border-rad-black-300"
          )}
        ></div>
      </div>
      <div>
        <div className="flex flex-row gap-2">
          <div
            className={classNames(
              "flex h-6 w-6 select-none items-center justify-center rounded-full text-center",
              stepper >= 2 ? "bg-rad-red-500" : "bg-rad-black-300"
            )}
          >
            <span className="font-semibold">
              {stepper > 2 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                "2"
              )}
            </span>
          </div>
          <span className="first-letter:uppercase">{selected}</span>
        </div>
      </div>
    </div>
  );

  const join = (
    <div className="w-full">
      <div className="flex flex-col gap-2">
        <Input
          className="rounded  bg-transparent p-1 outline outline-2 outline-rad-black-600 placeholder:text-sm placeholder:italic placeholder:text-rad-light-300/30 hover:outline-rad-black-400"
          placeholder="Code"
          value={serverCode}
          onChange={(e) => {
            setServerCode(e.target.value);
          }}
          onSubmit={() => {
            console.log("Joing");
          }}
        />
        <label>
          Pleas enter a code above. You can find the code to a server located in
          the top left of the server. Press the button and a code will be
          generated.
        </label>
      </div>
    </div>
  );

  const create = (
    <div className="w-full ">
      <div className="flex flex-col gap-2">
        <label className="font-semibold">Name</label>
        <input
          className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 placeholder:text-sm placeholder:italic placeholder:text-rad-light-300/30 hover:outline-rad-black-400"
          value={serverData.name}
          onChange={(e) => {
            e.preventDefault();
            setServerData({ ...serverData, name: e.target.value });
          }}
          placeholder="Server name"
        />
        <label className="font-semibold">Image</label>
        <input
          className="rounded bg-transparent p-1 outline outline-2 outline-rad-black-600 placeholder:text-sm placeholder:italic placeholder:text-rad-light-300/30 hover:outline-rad-black-400"
          value={serverData.image}
          placeholder="Image URL (blank for none)"
          onChange={(e) => {
            e.preventDefault();
            setServerData({ ...serverData, image: e.target.value });
          }}
        />
      </div>
    </div>
  );

  const selection = (
    <div className="flex w-full flex-col p-2">
      <div className="space-y-4">
        <h1 className="items-center justify-center p-2 text-center text-3xl font-bold">
          Create a server.
        </h1>
        <span>
          A server is where you will be able to chat and hangout with other
          people.
        </span>
        <button
          className="w-full rounded-md p-2 outline outline-1 outline-rad-black-600"
          onClick={(e) => {
            e.preventDefault();
            setSteps(2);
            setSelected("create");
          }}
        >
          <span>Create my own server</span>
        </button>
      </div>
      <div className="py-5">
        <hr className="border-rad-black-300" />
      </div>
      <div>
        <h1 className="pb-2 text-center text-lg font-bold">
          Already have a code?
        </h1>
        <button
          className="w-full rounded-md bg-rad-black-600 p-2"
          onClick={(e) => {
            e.preventDefault();
            setSteps(2);
            setSelected("join");
          }}
        >
          Join a Server
        </button>
      </div>
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full min-w-[28rem] max-w-lg space-y-4 p-2">
        {header}
        {stepper === 1 ? selection : <>{selected === "join" ? join : create}</>}
        {stepper >= 2 ? (
          <div className="flex flex-row justify-between">
            <button
              className="rounded px-3  py-2 font-semibold text-rad-black-300 hover:bg-rad-black-600/50"
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                setSteps(1);
              }}
            >
              Back
            </button>
            <button
              className="rounded bg-rad-black-600 px-3 py-2 font-semibold first-letter:uppercase"
              disabled={isDisabled}
              onClick={(e) => {
                e.preventDefault();
                switch (selected) {
                  case "create": {
                    console.log("Creating");
                    createServer({
                      image: serverData.image,
                      name: serverData.name,
                    });
                    break;
                  }
                  case "join": {
                    console.log("Joing");
                    joinServer({ id: serverCode });
                    break;
                  }
                  default: {
                    break;
                  }
                }
              }}
            >
              {selected}
            </button>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

export default CreateServerModal;
