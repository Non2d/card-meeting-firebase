import { ReactNode } from "react";
import { ClientBrowser } from "../utils/types";
import { BrowserIcon } from "./icon";

interface Props {
  displayName: string;
  browser: ClientBrowser;
  controllers: ReactNode;
}

function StreamController({ displayName, browser, controllers }: Props) {
  return (
    <div className="grid grid-cols-[1fr_auto] p-1 text-white bg-[rgba(0,0,0,0.5)] text-sm">
      <div className="inline-flex items-center">
        <BrowserIcon {...browser} />
        &nbsp;
        {displayName}
      </div>
      <div className="inline-flex items-center">{controllers}</div>
    </div>
  );
}

export default StreamController;
