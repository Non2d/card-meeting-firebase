import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function NotificationLayout({ children }: Props) {
  return (
    <div className="absolute top-2 left-2 z-notification">
      {children}
    </div>
  );
}

export default NotificationLayout;