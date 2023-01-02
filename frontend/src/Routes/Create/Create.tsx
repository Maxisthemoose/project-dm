import React from "react";
import LogoutButton from "../../components/Logout/Logout";
import { v4 } from "uuid";
import { Socket } from "socket.io-client";
export default function Create() {

  function createId() {
    return v4().slice(0, 8);
  }

  function createRoom() {
    const roomId = createId();
    // window.localStorage.setItem("dmFor", roomId);
    window.location.href = `/room/${roomId}`;
  }

  return (
    <div className="create-container">
      <LogoutButton />


      <div className="selection-container">
        <button onClick={() => createRoom()}>
          Create a Room
        </button>

        <button>
          Join Room
        </button>
      </div>

    </div>
  )
}