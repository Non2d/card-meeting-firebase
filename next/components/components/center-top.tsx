import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function CenterTop({ children }: Props) {
  return (
    <div className="absolute top-0 left-0 bottom-0 z-base">
      <div className="absolute left-2 top-2">{children}</div>
    </div>
  );
}

export default CenterTop;