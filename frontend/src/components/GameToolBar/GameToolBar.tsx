import React, { useState } from "react";
import Chat from "../Chat/Chat";
import { ReactComponent as ChatBubble } from "../../icons/chat-bubble.svg";
import { ReactComponent as AddUser } from "../../icons/add-user.svg";
import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Settings } from "../../icons/settings.svg";
import { Socket } from "socket.io-client";
import ReactModal from "react-modal";

import "./GameToolBar.css";
import 'reactjs-popup/dist/index.css';
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
export default function GameToolBar({ socket, users, messages }: { socket: Socket, users: any[], messages: any[] }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userDisplay, setUserDisplay] = useState(undefined);
  return (
    <div className="chat-sidebar">
      <div className="users-in-game">
        {
          users.map(user => [
            <div className="user-in-sidebar" onClick={() => setUserDisplay(user)}>
              {user.username}
            </div>
          ])
        }
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