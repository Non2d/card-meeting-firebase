import { rightMenuWidth } from "../utils/style";
import { useState, Fragment } from "react";
import { RoomStat } from "../utils/types";
import Video from "./video";
import StreamController from "./stream-controller";
import { Icon, IconButton } from "./icon";
import StreamInfo from "./stream-info";
import VADetector from "./va-detector";

interface Props {
  stream: MediaStream;
  stat: RoomStat | null;
  isPinned: boolean;
  onClickSetPinned: () => void;
}

function RemoteStreamLayout({
  stream,
  stat,
  isPinned,
  onClickSetPinned,
}: Props) {
  const isVideoDisabled = stat && stat.isVideoDisabled ? true : false;
  const [isInfoShown, setInfoShown] = useState(false);

  return (
    <Fragment>
      <div
        className="relative bg-black"
        style={{ height: `${(rightMenuWidth / 4) * 3}px` }}
      >
        <Video stream={stream} />
        <div className="absolute top-1 right-1 z-[100] flex items-center text-white">
          {!isVideoDisabled ? (
            <IconButton
              name={isPinned ? "cancel_presentation" : "present_to_all"}
              showEdge={true}
              title="Pin this video"
              onClick={onClickSetPinned}
            />
          ) : null}
          <IconButton
            name="info"
            showEdge={true}
            title="Toggle stream info"
            onClick={() => setInfoShown(!isInfoShown)}
          />
        </div>
        {isInfoShown && stat !== null ? (
          <div className="absolute inset-0 z-10">
            <StreamInfo stream={stream} browser={stat.browser} />
          </div>
        ) : null}
        <div className="absolute left-0 right-0 bottom-0 z-1">
          {stat !== null ? (
            <Fragment>
              <VADetector stream={stream} />
              <StreamController
                displayName={stat.displayName}
                browser={stat.browser}
                controllers={
                  <Fragment>
                    {stat.isVideoDisabled ? null : (
                      <Icon
                        name={stat.isVideoMuted ? "videocam_off" : "videocam"}
                      />
                    )}
                    <Icon name={stat.isAudioMuted ? "mic_off" : "mic"} />
                  </Fragment>
                }
              />
            </Fragment>
          ) : null}
        </div>
      </div>
    </Fragment>
  );
}

export default RemoteStreamLayout;
