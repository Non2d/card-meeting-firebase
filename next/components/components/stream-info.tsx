import { memo, useEffect, useState } from "react";
import { ClientBrowser } from "../utils/types";

interface Props {
  stream: MediaStream;
  browser: ClientBrowser;
}

function StreamInfo({ stream, browser }: Props) {
  const [info, setInfo] = useState({});
  useEffect(() => {
    let timer = 0;
    const updateInfo = () => {
      timer = requestAnimationFrame(updateInfo);

      const [vTrack] = stream.getVideoTracks();
      const [aTrack] = stream.getAudioTracks();
      const vSettings = vTrack ? vTrack.getSettings() : {};

      setInfo({
        timestamp: Date.now(),
        browserName: browser.name,
        browserVersion: `v${browser.version}`,
        streamId: stream.id,
        video: vTrack
          ? {
              trackId: vTrack.id,
              width: vSettings.width,
              height: vSettings.height,
              frameRate: vSettings.frameRate,
            }
          : {},
        audio: aTrack
          ? {
              trackId: aTrack.id,
            }
          : {},
      });
    };
    timer = requestAnimationFrame(updateInfo);

    return () => cancelAnimationFrame(timer);
  }, [stream, browser, setInfo]);

  return (
    <pre className="m-0 p-1 w-full h-full box-border overflow-auto touch-auto text-sm bg-black text-white">
      {JSON.stringify(info, null, 2)}
    </pre>
  );
}

export default memo(StreamInfo);
