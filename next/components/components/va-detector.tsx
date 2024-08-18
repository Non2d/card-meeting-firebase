//動的スタイルをインラインスタイルで実装

import { useState, useEffect, memo } from "react";
import hark from "hark";
import { Hark } from "../utils/types";

interface Props {
  stream: MediaStream;
}

function VADetector({ stream }: Props) {
  const [decibel, setDecibel] = useState(-Infinity);
  
  useEffect(() => {
    // if audio source is changing
    if (stream.getAudioTracks().length === 0) return;

    const harker = hark(stream, { threshold: -75 });
    // db: -100 ~ 0 (silent ~ loud)
    harker.on("volume_change", (db) => db !== -Infinity && setDecibel(db));

    return () => harker.stop();
  }, [stream]);

  return <div style={decibelToStyle(decibel)} className="bg-blue-500 will-change-[height,opacity]" />;
}

export default memo(VADetector);

const decibelToStyle = (db: number) => {
  if (db === -Infinity) return {};

  const audioLevel = db + 100; // 0 ~ 100
  return {
    height: `${audioLevel * 0.1}px`, // 0 ~ 10px
    opacity: audioLevel * 0.01, // 0 ~ 1
  };
};
