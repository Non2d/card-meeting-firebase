import { ReactNode } from "react";

interface Props {
  label: string;
  children: ReactNode;
}

export function SettingsItemDevice({ label, children }: Props) {
  return (
    <div className="mx-auto my-2">
      <div className="grid grid-cols-[80px_72px_1fr] gap-2 items-center">
        <div className="text-center">{label}</div>
        {children}
      </div>
    </div>
  );
}

export function SettingsItemName({ label, children }: Props) {
  return (
    <div className="mx-auto my-2">
      <div className="grid grid-cols-[80px_1fr] gap-2 items-center">
        <div className="text-center">{label}</div>
        <div>{children}</div>
      </div>
    </div>
  );
}
