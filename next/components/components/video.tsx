import { useRef, useEffect, Fragment, memo } from "react";
import debug from "debug";

const _log = debug("component:video");

interface Props {
  stream: MediaStream;
  isReverse?: boolean;
  isVideoOnly?: boolean;
}

function Video({ stream, isReverse = false, isVideoOnly = false }: Props) {
  const isNoAudio = stream.getAudioTracks().length === 0;
  const isNoVideo = stream.getVideoTracks().length === 0;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const log = _log.extend(stream.id);

  useEffect(() => {
    const $video = videoRef.current;
    if (isNoVideo || $video === null) {
      return;
    }

    log("useEffect(): assign and play stream for video");
    $video.srcObject !== stream && ($video.srcObject = stream);
    $video.paused && $video.play();
  }, [isNoVideo, videoRef, log, stream]);

  useEffect(() => {
    const $audio = audioRef.current;
    if (isNoAudio || isVideoOnly || $audio === null) {
      return;
    }

    log("useEffect(): assign and play stream for audio");
    $audio.srcObject !== stream && ($audio.srcObject = stream);
    $audio.paused && $audio.play();
  }, [isNoAudio, isVideoOnly, audioRef, log, stream]);

  log("render()", [...stream.getTracks()]);
  return (
    <Fragment>
      {isNoVideo ? null : (
        <video
          className={`w-full h-full max-w-full max-h-full pointer-events-none ${
            isReverse ? "transform -scale-x-100" : ""
          }`}
          ref={videoRef}
          playsInline
          muted
        />
      )}
      {isVideoOnly || isNoAudio ? null : (
        <audio className="hidden" ref={audioRef} />
      )}
    </Fragment>
  );
}

export default memo(Video);
