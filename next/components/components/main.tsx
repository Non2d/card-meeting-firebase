import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Main({ children }: Props) {
  const backgroundImageUrl = `${process.env.NODE_ENV !== 'development' ? '/card-meet' : ''}/icon/logo.svg`;

  return (
    <div className="relative w-full h-full bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImageUrl})` }}>
      {children}
    </div>
  );
}

export default Main;