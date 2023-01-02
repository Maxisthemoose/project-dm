import React, { useEffect, useState } from "react";
import Chat from "../../components/Chat/Chat";
import { useParams } from "react-router-dom";
import { useAuthUser } from "react-auth-kit";
import io from "socket.io-client";
import "./Room.css";
import Map from "../../components/Map/Map";
const socket = io("http://192.168.1.7:3001");

export default function Room() {
  const authUser = useAuthUser();
  const params = useParams();
  const [messages, setMessages] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);

  useEffect(() => {
    const user = authUser();
    socket.emit("join", { room: params.id, username: user!.username, email: user!.email });

    socket.on("get_users", room => {
      socket.emit("get_users", room)
    });

    socket.on("recieve_users", (data) => {
      setUsers(data.users);
    });

    socket.on("get_messages", room => {
      socket.emit("get_messages", room);
    });

    socket.on("recieve_messages", (data) => {
      console.log(data, "in room");
      setMessages(data);
      // socket.off("recieve_messages");
    });

  }, [socket]);

  return (
    <div className="game-window">
      <Chat socket={socket} users={users} messages={messages} />
      <Map socket={socket} />
    </div>
  )
}