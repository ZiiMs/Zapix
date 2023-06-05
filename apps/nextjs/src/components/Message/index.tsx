import React, { useEffect } from "react";
import classNames from "classnames";

import CustomImage from "../CustomImage";

const Message: React.FC<{
  username: string;
  image: string | undefined;
  text: string;
  createdAt: Date;
  classNames?: string;
}> = ({ createdAt, image, text, username, classNames: classNamesProp }) => {
  return (
    <div
      className={classNames(
        "flex h-fit w-full flex-row items-start justify-start py-2",
        classNamesProp,
      )}
    >
      <div className="px-2">
        <CustomImage
          name={username}
          src={image}
          width={36}
          height={36}
          className={"rounded-full bg-rad-black-500 text-lg font-bold"}
        />
      </div>
      <div className="flex flex-col">
        <div className="flex flex-row items-start justify-start gap-x-2 text-start">
          <span className="font-bold ">{username}</span>
          <span className="text-sm italic text-rad-light-400/30">
            {typeof createdAt === "string"
              ? new Date(createdAt).toLocaleDateString()
              : createdAt.toLocaleDateString()}
          </span>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
};

export default Message;
