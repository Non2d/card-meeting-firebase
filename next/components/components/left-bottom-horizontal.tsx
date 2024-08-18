import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function LeftBottomHorizontal({ children }: Props) {
  return (
    <div className="absolute top-0 left-0 bottom-0 z-base">
      <div className="absolute left-2 bottom-2 flex flex-row gap-4">
        {children}
      </div>
    </div>
  );
}

export default LeftBottomHorizontal;