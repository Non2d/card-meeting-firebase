import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Main({ children }: Props) {
  return (
    <div className="relative w-full h-full bg-center bg-no-repeat" style={{ backgroundImage: "url(/icon/logo.svg)" }}>
      {children}
    </div>
  );
}

export default Main;
