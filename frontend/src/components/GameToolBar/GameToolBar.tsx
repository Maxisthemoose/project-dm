import React, { useEffect, useState } from "react";
import Chat from "../Chat/Chat";
import { ReactComponent as ChatBubble } from "../../icons/chat-bubble.svg";
import { ReactComponent as AddUser } from "../../icons/add-user.svg";
import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Settings } from "../../icons/settings.svg";
import { Socket } from "socket.io-client";
import ReactModal from "react-modal";
import PerfectScrollBar from "react-perfect-scrollbar";
import { DnDCharacter, DnDCharacterProfileSheet, DnDCharacterSpellSheet, DnDCharacterStatsSheet } from "dnd-character-sheets";

import "./GameToolBar.css";
import 'reactjs-popup/dist/index.css';
import { useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: "300px",
    height: "400px",
    backgroundColor: "black",
    color: "white",
    transform: 'translate(-50%, -50%)',
    zIndex: 101,
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.3)",
    zIndex: 101,
  }
};
export default function GameToolBar({ socket }: { socket: Socket }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userDisplay, setUserDisplay] = useState(undefined);

  const authUser = useAuthUser();
  const params = useParams();
  const [messages, setMessages] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);

  // TODO: Get character sheet that player chose before joining lobby
  // I guess that means I'll have to have you choose a character AFTER you join... :(
  async function getUserSheets(user: any) {

  }

  useEffect(() => {
    const user = authUser();

    const roomData = {
      room: params.id,
      username: user!.username,
    };
    console.log(roomData, "AHHH");
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

    socket.on("recieve_message", (message) => {
      setMessages(old => [...old, message]);
    });
    socket.on("recieve_dm", (data) => {
      setMessages(old => [...old, data]);
    });

  }, [socket]);


  return (
    <div className="chat-sidebar">
      <PerfectScrollBar className="users-in-game">
        {
          users.map(user => [
            <div className="user-in-sidebar" onClick={() => setUserDisplay(user)}>
              <p>{user.username}</p>
            </div>
          ])
        }
      </PerfectScrollBar>
      <div className="user-utilities">

      </div>
      <div className="util-buttons">
        <ChatBubble title="Click to open game chat." className="open-chat" onClick={() => setChatOpen(!chatOpen)} />
        <AddUser className="open-invite" onClick={() => setInviteOpen(!inviteOpen)} />
        <Settings className="settings-cog" />
        <ReactModal isOpen={inviteOpen} style={customStyles}>
          <div>
            <Close className="close-invite" onClick={() => setInviteOpen(false)} />
            <div className="invite-friends">
              <p className="how-to">Invite players by giving them this link</p>
              <p
                className="invite-link"
                onClick={() => navigator.clipboard.writeText(window.location.href)}>{window.location.href}
              </p>
              <p className="click-to-copy">Click the link to copy!</p>
              <button onClick={() => navigator.clipboard.writeText(window.location.href)} className="button-copy">Copy Link</button>
            </div>
          </div>
        </ReactModal>

        <ReactModal isOpen={userDisplay !== undefined}>
          <div>
            <Close className="close-user" onClick={() => setUserDisplay(undefined)} />


          </div>
        </ReactModal>

      </div>

      {
        chatOpen ?
          <Chat socket={socket} users={users} messages={messages} setChatOpen={setChatOpen} />
          : ""
      }
    </div >
  )
}