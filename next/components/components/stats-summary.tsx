import {
  extractCandidatePairs,
  extractOutboundRtps,
  extractInboundRtps,
} from "../utils/stats";
import { WebRTCStats } from "@skyway-sdk/room";

interface Props {
  rtcStats: WebRTCStats | null;
}
function StatsSummary({ rtcStats }: Props) {
  const summarizedStats = rtcStats === null ? null : summarizeStats(rtcStats);

  return (
    <div className="m-0 p-1 text-sm">
      <pre className="m-0 whitespace-pre-wrap break-words">
        {summarizedStats === null ? "Loading..." : summarizedStats}
      </pre>
    </div>
  );
}

export default StatsSummary;

const summarizeStats = (stats: WebRTCStats) => {
  const candidatePairs = extractCandidatePairs(stats);
  const { audioOutbounds, videoOutbounds } = extractOutboundRtps(stats);
  const { audioInbounds, videoInbounds } = extractInboundRtps(stats);

  return `
# Active ICE candidate pairs
${candidatePairs
  .map(({ localCandidate, remoteCandidate }, idx) =>
    `
## Pair ${idx + 1}
- local: ${localCandidate.type} ${localCandidate.protocol}://${localCandidate.address}:${localCandidate.port}
- remote: ${remoteCandidate.type} ${remoteCandidate.protocol}://${remoteCandidate.address}:${remoteCandidate.port}
`.trim(),
  )
  .join("\n")
  .trim()}

# Outbounds(sent)
- Audio: ${audioOutbounds.bytesSent} bytes(${audioOutbounds.packetsSent} packets)
- Video: ${videoOutbounds.bytesSent} bytes(${videoOutbounds.packetsSent} packets)

# Inbounds(received)
## Total
- ${audioInbounds.size} audio(s)
  - ${audioInbounds.bytesReceived} bytes(${audioInbounds.packetsReceived} packets)
  - PacketsLost: ${audioInbounds.packetsLost}
- ${videoInbounds.size} video(s)
  - ${videoInbounds.bytesReceived} bytes(${videoInbounds.packetsReceived} packets)
  - PacketsLost: ${videoInbounds.packetsLost} /
    NACK: ${videoInbounds.nackCount} /
    FIR: ${videoInbounds.firCount} /
    PLI: ${videoInbounds.pliCount}

## Details
${audioInbounds.items
  .map((item, idx) =>
    `
- Audio ${idx + 1}: ${item.ssrc}
  - ${item.bytesReceived} bytes(${item.packetsReceived} packets)
  - PacketsLost: ${item.packetsLost}
`.trim(),
  )
  .join("\n")
  .trim()}
${videoInbounds.items
  .map((item, idx) =>
    `
- Video ${idx + 1}: ${item.ssrc}
  - ${item.bytesReceived} bytes(${item.packetsReceived} packets)
  - PacketsLost: ${item.packetsLost} /
    NACK: ${item.nackCount} /
    FIR: ${item.firCount} /
    PLI: ${item.pliCount}
`.trim(),
  )
  .join("\n")
  .trim()}
  `.trim();
};
