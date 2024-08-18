import { useState, ReactNode } from "react";
import { zIndex, rightMenuWidth, rightMenuTogglerHeight } from "../utils/style";
import { IconButton } from "./icon";

interface Props {
  children: ReactNode;
  openers: ReactNode[];
}

function RightMenu({ children, openers }: Props) {
  const [isVisible, setVisible] = useState(true);

  return (
    <div
      className={`absolute top-0 right-0 bottom-0 bg-gray-500 h-full transition-transform duration-300 ${
        isVisible ? "translate-x-0" : `translate-x-${rightMenuWidth}`
      }`}
      style={{ zIndex: zIndex.base, width: `calc(${rightMenuWidth}px - 15px)` }}
    >
      <div className="h-full overflow-y-scroll">{children}</div>
      <div
        className="absolute flex items-center justify-center bg-inherit cursor-pointer border-b border-white"
        style={{
          left: -rightMenuTogglerHeight,
          width: rightMenuTogglerHeight,
          height: rightMenuTogglerHeight,
          top: 0,
        }}
        onClick={() => setVisible(!isVisible)}
      >
        <IconButton
          name={isVisible ? "chevron_right" : "chevron_left"}
          onClick={() => setVisible(!isVisible)}
        />
      </div>
      {openers.map((opener, idx) => (
        <div
          key={idx}
          className="absolute flex items-center justify-center bg-inherit cursor-pointer border-b border-white"
          style={{
            left: -rightMenuTogglerHeight,
            width: rightMenuTogglerHeight,
            height: rightMenuTogglerHeight,
            top: rightMenuTogglerHeight * (idx + 1),
          }}
        >
          {opener}
        </div>
      ))}
    </div>
  );
}

export default RightMenu;
