import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function CenterField({ children }: Props) {
  return (
    <div className="absolute top-0 left-0 bottom-0 right-0 flex items-center justify-center">
      <div>{children}</div>
    </div>
  );
}

export default CenterField;