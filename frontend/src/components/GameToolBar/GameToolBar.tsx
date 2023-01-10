import React, { useEffect, useState, useRef } from "react";
import Chat from "../Chat/Chat";
import { ReactComponent as ChatBubble } from "../../icons/chat-bubble.svg";
import { ReactComponent as AddUser } from "../../icons/add-user.svg";
import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Settings } from "../../icons/settings.svg";
import { ReactComponent as CharacterView } from "../../icons/character-sheet.svg";
import { ReactComponent as Video } from "../../icons/video.svg";
import { ReactComponent as DM } from "../../icons/dm.svg";
import { Socket } from "socket.io-client";
import Webcam from "react-webcam";
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

const customStylesCharacterSheet: ReactModal.Styles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    width: "90%",
    height: "90%",
    backgroundColor: "white",
    userSelect: "none",
    transform: 'translate(-50%, -50%)',
    zIndex: "104",
  },
  overlay: {
    backgroundColor: "rgb(0,0,0,0.3)",
    zIndex: "104",
  }
};


export default function GameToolBar({ socket, character }: { socket: Socket, character: { data: DnDCharacter; _id: string; } }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [userDisplay, setUserDisplay] = useState(undefined);
  const [characterSheetOpen, setCharacterSheetOpen] = useState(false);
  const [conferenceOpen, setConferenceOpen] = useState(false);

  const authUser = useAuthUser();
  const params = useParams();
  const [messages, setMessages] = useState([] as any[]);
  const [users, setUsers] = useState([] as any[]);
  const [stream, setStream] = useState<MediaStream>();
  const myVideoRef = useRef(null as any);

  useEffect(() => {

    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideoRef.current.srcObject = currentStream;
      });

    const user = authUser();;
    const roomData = {
      room: params.id,
      username: user!.username,
    };
    socket.emit("create_room", roomData)
    setTimeout(() => {
      socket.emit("join_room", roomData);
    }, 100);

    socket.on("recieve_users", (data) => {
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
              {user.isDM && <DM className="dungeon-master" />}
              <p>{
                (user.isDM ?
                  user.username.length > 6 :
                  user.username.length > 10) ?
                  (user.isDM ? user.username.slice(0, 6) + "..." :
                    user.username.slice(0, 10) + "...") :
                  user.username
              }</p>
            </div>
          ])
        }
      </PerfectScrollBar>
      <div className="user-utilities">
        <CharacterView onClick={() => setCharacterSheetOpen(true)} />
        <Video className="video-select" onClick={() => setConferenceOpen(true)} />
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

        <ReactModal style={customStyles} isOpen={userDisplay !== undefined}>
          <div>
            <Close className="close-user" onClick={() => setUserDisplay(undefined)} />


          </div>
        </ReactModal>

        <ReactModal style={customStylesCharacterSheet} isOpen={characterSheetOpen}>
          <Close className="close-user" style={{ color: "black" }} onClick={() => setCharacterSheetOpen(false)} />
          <div>
            <DnDCharacterStatsSheet character={character.data} />
            <DnDCharacterProfileSheet character={character.data} />
            <DnDCharacterSpellSheet character={character.data} />
          </div>
        </ReactModal>

        <ReactModal style={customStylesCharacterSheet} isOpen={conferenceOpen}>
          <Close className="close-user" style={{ color: "black" }} onClick={() => setConferenceOpen(false)} />
          <div>
            {/* <Webcam /> */}
            <div className="you-video">
              {/* https://www.npmjs.com/package/simple-peer */}
              {/* https://youtu.be/oxFr7we3LC8?t=2187 */}
            </div>
            <div className="other-video">

            </div>
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