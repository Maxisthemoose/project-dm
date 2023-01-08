import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/Chat";
import { useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import io from "socket.io-client";
import "./Room.css";
import Map from "../../components/Map/Map";
import { ChatBubble } from "@mui/icons-material";
import GameToolBar from "../../components/GameToolBar/GameToolBar";
const socket = io(process.env.REACT_APP_BASE_URL!);

export default function Room() {
  const authUser = useAuthUser();
  const params = useParams();
  const [messages, setMessages] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    const user = authUser();

    const roomData = {
      room: params.id,
      username: user!.username,
    };

    socket.emit("create_room", roomData)
    setTimeout(() => {
      socket.emit("join_room", roomData);
    }, 100);

    socket.on("recieve_users", (data) => {
      console.log("New users recieved");
      setUsers(data);
    });
    socket.on("recieve_messages", (data) => {
      setMessages(data);
      socket.off("recieve_messages");
    });

  }, [socket]);

  return (
    <div className="game-window">
      <div className="game-toolbar">
        <GameToolBar messages={messages} socket={socket} users={users} />
      </div>
      <Map socket={socket} />
    </div>
  )
}