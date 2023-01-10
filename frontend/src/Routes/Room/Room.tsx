import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/Chat";
import { useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import io from "socket.io-client";
import "./Room.css";
import Map from "../../components/Map/Map";
import { ChatBubble } from "@mui/icons-material";
import GameToolBar from "../../components/GameToolBar/GameToolBar";
console.log(process.env.REACT_APP_BASE_URL);
const socket = io(process.env.REACT_APP_BASE_URL!);

export default function Room() {




  return (
    <div className="game-window">
      <div className="game-toolbar">
        <GameToolBar socket={socket} />
      </div>
      <Map socket={socket} />
    </div>
  )
}