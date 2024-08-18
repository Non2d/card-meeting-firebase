import { useState, Fragment } from "react";
import { WebRTCStats } from "@skyway-sdk/room";

interface Props {
  rtcStats: WebRTCStats | null;
}

function StatsDump({ rtcStats }: Props) {
  const [searchKey, setSearchKey] = useState("");
  const filteredStats =
    rtcStats === null ? null : filterStats(rtcStats, searchKey.trim());

  return (
    <Fragment>
      <input
        type="text"
        placeholder="filter stat reports"
        value={searchKey}
        onChange={(ev) => setSearchKey(ev.target.value)}
        className="box-border w-full"
      />
      <pre className="m-0 p-1 text-xs whitespace-pre-wrap break-all">
        {filteredStats === null
          ? "Loading..."
          : `${filteredStats.size} report(s) found.\n${JSON.stringify(
              filteredStats.reports,
              null,
              2,
            )}`}
      </pre>
    </Fragment>
  );
}

export default StatsDump;

const filterStats = (stats: WebRTCStats, searchKey: string) => {
  // stats not ready
  if (stats.length === 0) {
    return null;
  }

  let length = 0;
  const res: { [key: string]: unknown } = {};
  stats.forEach((stat: any) => { //何で今までstat)で動いてたんだよ
    const key = stat.id;
    const value = stat;
    const index = JSON.stringify(value);
    // empty string is treated as included
    if (index.includes(searchKey)) {
      res[key] = value;
      length++;
    }
  });
  return { reports: res, size: length };
};
