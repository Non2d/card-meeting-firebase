// import { globalColors } from "../../../../next/shared/global-style";
// import { modalContentWidth } from "../utils/style";
import Modal from "./modal";
import { IconButton } from "./icon";
import StatsSummary from "./stats-summary";
import StatsDump from "./stats-dump";
import { WebRTCStats } from "@skyway-sdk/room";

interface Props {
  isSFU: boolean;
  rtcStats: WebRTCStats | null;
  onClickCloser: () => void;
}

function StatsLayout({ isSFU, rtcStats, onClickCloser }: Props) {
  return (
    <Modal>
      {/* <div css={wrapperStyle}> */}
      <div className="grid grid-rows-[20px_1fr] w-[var(--modal-content-width)] h-[80%] box-border m-[32px_auto_0] p-2 bg-white">
        <div className="text-right">
          <IconButton name="close" onClick={onClickCloser} />
        </div>
        {isSFU ? (
          <div className="box-border overflow-hidden overflow-y-scroll touch-scroll">
            <details open>
              <summary>Stats summary</summary>
              <StatsSummary rtcStats={rtcStats} />
            </details>
            <details>
              <summary>Stats dump</summary>
              <StatsDump rtcStats={rtcStats} />
            </details>
          </div>
        ) : (
          <div className="text-center">Stats view is not available in p2p room type.</div>
        )}
      </div>
    </Modal>
  );
}

export default StatsLayout;

// const wrapperStyle = css({
//   display: "grid",
//   gridTemplateRows: "20px 1fr",
//   width: modalContentWidth,
//   height: "80%",
//   boxSizing: "border-box",
//   margin: "32px auto 0",
//   padding: 8,
//   backgroundColor: globalColors.white,
// });