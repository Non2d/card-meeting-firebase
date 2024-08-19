import { useState, Fragment } from "react";
import { ClientBrowser, VideoType } from "../utils/types";
import StreamController from "./stream-controller";
import Video from "./video";
import { IconButton } from "./icon";
import StreamInfo from "./stream-info";
import VADetector from "./va-detector";

interface Props {
  stream: MediaStream;
  displayName: string;
  browser: ClientBrowser;
  videoType: VideoType;
  isVideoTrackMuted: boolean;
  isAudioTrackMuted: boolean;
  onClickToggleAudioMuted: () => void;
  onClickToggleVideoMuted: () => void;
  onClickCastVideo: () => void;
  onClickOpenSettings: () => void;
}

function LocalStreamLayout({
  stream,
  displayName,
  browser,
  videoType,
  isVideoTrackMuted,
  isAudioTrackMuted,
  onClickToggleAudioMuted,
  onClickToggleVideoMuted,
  onClickCastVideo,
  onClickOpenSettings,
}: Props) {
  const [isMinimize, setMinimize] = useState(false);
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <div
      className={`outline transition-all ease-in-out duration-200 will-change-transform ${
        isMinimize ? "transform -translate-x-4/5" : ""
      }`}
    >
      <div className="relative w-60 h-44 bg-black">
        <Video stream={stream} isReverse={videoType === "camera"} isVideoOnly={true} />
        <div className="absolute top-1 right-1 z-100 flex items-center text-white">
          {videoType !== null && (
            <IconButton
              name="cast"
              showEdge={true}
              title="Cast your video"
              onClick={onClickCastVideo}
            />
          )}
          <IconButton
            name="info"
            showEdge={true}
            title="Toggle stream info"
            onClick={() => setInfoShown(!isInfoShown)}
          />
          <IconButton
            name="settings"
            showEdge={true}
            title="Open settings"
            onClick={onClickOpenSettings}
          />
          {/* {isMinimize ? (
            <IconButton
              name="keyboard_arrow_right"
              showEdge={true}
              title="Maximize"
              onClick={() => setMinimize(false)}
            />
          ) : (
            <IconButton
              name="keyboard_arrow_left"
              showEdge={true}
              title="Minimize"
              onClick={() => setMinimize(true)}
            />
          )} */}
        </div>
        {isInfoShown && (
          <div className="absolute inset-0 z-10">
            <StreamInfo stream={stream} browser={browser} />
          </div>
        )}
        <div className="absolute left-0 right-0 bottom-0 z-1">
          <VADetector stream={stream} />
          <StreamController
            displayName={displayName}
            browser={browser}
            controllers={
              <Fragment>
                {videoType !== null && (
                  <IconButton
                    name={isVideoTrackMuted ? "videocam_off" : "videocam"}
                    title={isVideoTrackMuted ? "Unmute video" : "Mute video"}
                    onClick={onClickToggleVideoMuted}
                  />
                )}
                <IconButton
                  name={isAudioTrackMuted ? "mic_off" : "mic"}
                  title={isAudioTrackMuted ? "Unmute audio" : "Mute audio"}
                  onClick={onClickToggleAudioMuted}
                />
              </Fragment>
            }
          />
        </div>
      </div>
    </div>
  );
}

export default LocalStreamLayout;
