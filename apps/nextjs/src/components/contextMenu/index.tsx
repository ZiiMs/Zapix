import React, { useCallback, useEffect, useRef, type ReactNode } from "react";
import classNames from "classnames";

const ContextMenu: React.FC<{
  showMenu: boolean;
  x: number;
  y: number;
  toggleMenu: () => void;
  children: ReactNode;
}> = ({ showMenu, x, y, children, toggleMenu }) => {
  const ref = useRef<HTMLDivElement>(null);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (ref.current?.contains(e.target as Node)) {
        return;
      }
      toggleMenu();
    },
    [toggleMenu],
  );

  const handleContextMenu = useCallback(
    (e: MouseEvent) => {
      console.log("contextMenu clicked", e);
      if (!e.defaultPrevented) {
        toggleMenu();
      }
    },
    [toggleMenu],
  );

  useEffect(() => {
    document.addEventListener("click", handleClick);
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  });

  if (!showMenu) return null;

  return (
    <div
      ref={ref}
      className={classNames(
        `absolute h-fit w-fit rounded-sm bg-rad-black-800 outline outline-1 outline-rad-black-300 backdrop-blur-sm`,
      )}
      style={{
        top: y + "px",
        left: x + "px",
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
    >
      {children}
    </div>
  );
};

export default ContextMenu;
