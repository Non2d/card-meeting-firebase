"use client";
import { useState } from "react";
import {
  isValidRoomName,
  roomNameRegex,
  maxRoomNameLength,
  messageForValidRoomName,
} from "../../shared/validate";
import { RoomInit } from "../index-utils/types";

interface Props {
  onSubmit: (init: RoomInit) => void;
}
function RoomCreate(props: Props) {
  const [roomType, setRoomType] = useState("SFU");
  const [roomName, setRoomName] = useState("");
  const [isRoomNameValid, setRoomNameValid] = useState(true);

  return (
    <form
      className="bg-white border border-gray-300 p-4 rounded-md"
      onSubmit={(ev) => {
        ev.preventDefault();
        props.onSubmit({ mode: roomType as RoomInit["mode"], id: roomName });
      }}
    >
      <h1 className="text-blue-500 text-4xl text-center">Card-Game-Based Meeting</h1>
      <div className="grid grid-cols-[100px_1fr] items-center h-10 mb-1 text-left">

        <div>ROOM NAME</div>
        <input
          type="text"
          value={roomName}
          placeholder="room-name"
          onChange={(ev) => setRoomName(ev.target.value)}
          onBlur={() => setRoomNameValid(isValidRoomName(roomName))}
          required
          maxLength={maxRoomNameLength}
          pattern={roomNameRegex}
          className="w-full box-border appearance-none border-0 border-b border-gray-300 text-lg p-1 focus:border-blue-500"
        />
      </div>
      <span className="text-red-500 text-sm">
        {isRoomNameValid ? "" : messageForValidRoomName}
      </span>

      <div className="grid grid-cols-[100px_1fr] items-center h-10 mb-1 text-left">
        <div>ROOM TYPE</div>
        <div>
          {["SFU", "P2P"].map((type) => (
            <label key={type} className="mr-2 text-lg">
              <input
                type="radio"
                onChange={() => setRoomType(type)}
                value={type}
                checked={roomType === type}
                name="room-type"
                className="align-middle"
              />{" "}
              {type}
            </label>
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6">
        <button
          className="bg-blue-500 text-white h-10 border-0 cursor-pointer px-6 text-lg rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          type="submit"
          disabled={!isValidRoomName(roomName)}
        >
          CREATE ROOM
        </button>
      </div>
    </form>
  );
}

export default RoomCreate;