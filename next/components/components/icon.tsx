import { SyntheticEvent } from "react";
import { ClientBrowser } from "../utils/types";
import Image from "next/image";

interface Props {
  name: string;
  showEdge?: boolean;
}
export function Icon({ name, showEdge }: Props) {
    const src = `/icon/${name}.svg`;
    return <Image alt={name} src={src} width={32} height={32}/>;
}

export function BrowserIcon({ name, version }: ClientBrowser) {
  let src = null;
  switch (name) {
    case "Chrome":
    case "Firefox":
    case "Safari":
      src = `/icon/icon-${name.toLowerCase()}.svg`; //Chrome or Firefox or Safariという意味． breakついてないからね
      break;
    case "Microsoft Edge":
      src = "/icon/icon-edge.svg";
      break;
  }

  const title = `${name} v${version}`;

  return src !== null ? (
    <Image alt={title} src={src} width={32} height={32}/>
  ) : (
    <Icon name="info" />
  );
}

interface ButtonProps extends Props {
  onClick: (ev: SyntheticEvent<HTMLButtonElement>) => void;
  title?: string;
  disabled?: boolean;
}
export function IconButton({
  name,
  showEdge,
  title,
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={`p-0 h-6 appearance-none border-none bg-none text-inherit cursor-pointer ${disabled ? "opacity-60 cursor-not-allowed" : ""
        }`}
    >
      <Icon name={name} showEdge={showEdge} />
    </button>
  );
}
