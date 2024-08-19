import debug from "debug";
const log = debug("effect:exit");

export const exitRoom = ({ channelId, myMemberId }: { channelId: string, myMemberId: string }) => {
  log("exitRoom()");

  const yes = confirm("Are you sure to exit?");
  if (!yes) {
    log("canceled");
    return;
  }

  location.href = "/";

  console.log("kokoda myMemberId: " + myMemberId);
  console.log("kokoda channelId: " + channelId);
  const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7771" : "https://vps4.nkmr.io/card-meet/v1";
  fetch(API_URL_prefix + "/rooms/" + channelId + "/" + myMemberId, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
};