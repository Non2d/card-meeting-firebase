import { makeObservable, observable, computed, action } from "mobx";
import { RoomInit, RoomStat } from "../utils/types";
import {
  P2PRoom,
  SfuRoom,
  RemoteAudioStream,
  RemoteVideoStream,
  LocalP2PRoomMember,
  LocalSFURoomMember,
  WebRTCStats,
} from "@skyway-sdk/room";

// import cardContents from '../card-game/card-contents';

class RoomStore {
  memberName: string | null;
  member: LocalP2PRoomMember | LocalSFURoomMember | null;
  isReady: boolean;
  room: P2PRoom | SfuRoom | null;
  mode: RoomInit["mode"] | null;
  id: RoomInit["id"] | null;
  useH264: RoomInit["useH264"];
  streams: Map<string, MediaStream>;
  remoteAudioStreams: Map<string, RemoteAudioStream>;
  remoteVideoStreams: Map<string, RemoteVideoStream>;
  stats: Map<string, RoomStat>;
  pinnedMemberId: string | null;
  castRequestCount: number;
  rtcStats: WebRTCStats | null;

  constructor() {
    // Member instance
    this.memberName = null;
    this.member = null;
    this.isReady = false;
    // (SFU|P2P)Room instance
    this.room = null;
    // room name = mode + id
    this.mode = null;
    this.id = null;
    this.useH264 = false;

    this.streams = new Map();
    this.remoteAudioStreams = new Map();
    this.remoteVideoStreams = new Map();
    this.stats = new Map();
    this.pinnedMemberId = null;
    this.castRequestCount = 0;
    this.rtcStats = null;

    makeObservable(this, {
      member: observable.ref,
      isReady: observable,
      room: observable.ref,
      mode: observable,
      id: observable,
      streams: observable.shallow,
      stats: observable.shallow,
      pinnedMemberId: observable,
      castRequestCount: observable,
      rtcStats: observable.ref,
      name: computed,
      isJoined: computed,
      pinnedStream: computed,
      load: action,
      loadMember: action,
      removeStream: action,
      cleanUp: action,
    });
  }

  get name(): string {
    return `${this.mode}/${this.id}`;
  }

  get isJoined(): boolean {
    return this.member !== null;
  }

  get pinnedStream(): MediaStream | null {
    if (this.pinnedMemberId === null) {
      return null;
    }
    return this.streams.get(this.pinnedMemberId) || null;
  }

  load(
    { mode, id, useH264 }: RoomInit,
    skywayRoom: P2PRoom | SfuRoom,
    memberName: string,
  ) {
    this.mode = mode;
    this.id = id;
    this.useH264 = useH264;
    this.room = skywayRoom;
    this.memberName = memberName;
    this.isReady = true;
  }

  loadMember(member: LocalP2PRoomMember | LocalSFURoomMember, memberDisplayName: string) {
    this.member = member;

    const onMemberLoaded = async () => {
      console.log('Member has been loaded:', this.member);

      if (this.room && this.member) {
        // console.log("MEMBER ID2" + JSON.stringify(this.member.id));

        const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7771" : "https://vps4.nkmr.io/card-meet/v1";

        const findOrCreateRoom = await fetch(API_URL_prefix + "/rooms/" + this.member.roomName, {
          method: "GET",
          headers: {
            "Content-Type": "application",
          }
        });

        try {
          const addMember = await fetch(API_URL_prefix + "/rooms/" + this.member.roomName + "/" + this.member.id, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "name": memberDisplayName,
            })
          });
        } catch (e) {
          console.error("Error in adding member. Room really exists?");
        }

      } else {
        console.error("Error in finding channel or member");
      }
    }

    onMemberLoaded();

    this.member.onLeft.add(async () => {
      console.log('A member has left the room');

      if (this.room !== null && this.member !== null) {
        // console.log("I AM IN " + JSON.stringify(this.room));　こいつのせいでエラーになった
        const API_URL_prefix = process.env.NODE_ENV === "development" ? "http://localhost:7771" : "https://vps4.nkmr.io/card-meet/v1";
        try {
          const response = await fetch(API_URL_prefix + "/rooms/" + this.member.roomName + "/" + this.member.id, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.error('Fetch error:');
        }
      } else {
        console.log("Error in finding channel or member");
      }
    });
  }

  removeStream(memberId: string) {
    this.streams.delete(memberId);
    this.stats.delete(memberId);
    if (this.pinnedMemberId === memberId) {
      this.pinnedMemberId = null;
    }
  }

  cleanUp() {
    if (this.room === null) {
      throw new Error("Room is null!");
    }

    [...this.streams.values()].forEach((stream) =>
      stream.getTracks().forEach((track) => track.stop()),
    );
    this.streams.clear();
    this.stats.clear();
    this.room = null;
  }
}

export default RoomStore;
