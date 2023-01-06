import React, { useState, useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import { useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import Draggable from "react-draggable";
import { ReactComponent as Close } from "../../icons/close.svg";
import { ReactComponent as Menu } from "../../icons/menu-icon.svg";
import Popup from "reactjs-popup";
import { ReactComponent as ChatBubble } from "../../icons/chat-bubble.svg";
import ScrollToBottom from "react-scroll-to-bottom";
import "./Chat.css";

const contentStyle = { background: 'rgb(25, 25, 25)' };
const arrowStyle = { color: 'rgb(25, 25, 25)' };

export default function Chat({ socket, users, messages, setChatOpen }: { socket: Socket; users: any[]; messages: any[], setChatOpen: Function }) {
  const authUser = useAuthUser();
  const params = useParams();
  const [selectedUser, setSelectedUser] = useState("all");
  const [messageHistory, setMessageHistory] = useState(messages);
  const [usersOpen, setUsersOpen] = useState(false);

  function sendMessage(ev: React.FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const user = authUser();

    const form = new FormData(ev.currentTarget);
    // console.log(form);
    const message = form.get("message") as string;
    if (message.length < 1) return;
    ev.currentTarget.reset();

    if (selectedUser !== "all") {
      const data = { room: params.id, isDirect: true, _id: users.find(u => u.username === selectedUser)._id, to: users.find(u => u.username === selectedUser).username, from: user!.username, message }
      socket.emit("send_dm", data);
      setMessageHistory(old => [...old, data]);
    } else {
      socket.emit("message_send", { room: params.id, author: user!.username, message });
      socket.emit("get_messages", params.id);
    }

  }

  useEffect(() => {
    socket.emit("get_messages", params.id);
    socket.on("recieve_messages", (messages) => {
      setMessageHistory(messages);
    });

    socket.on("recieve_dm", (data) => {
      setMessageHistory(old => [...old, data]);
    });

  }, []);


  return (
    <Draggable handle=".chat-header">
      <div className="chat-wrapper">
        <div className="chat-header">
          <Close onClick={() => setChatOpen(false)} className="close-chat" />
          {/* <Menu onClick={() => setUsersOpen(false)} onTouchStart={() => setUsersOpen(false)} className="open-close-users" /> */}
          <Popup
            trigger={
              <Menu className="open-close-users" />
            }
            arrowStyle={arrowStyle}
            contentStyle={contentStyle}
            modal={false}
            closeOnDocumentClick={true}
            closeOnEscape={true}
            position={"left top"}
            repositionOnResize={true}
            on={["hover", "click", "focus"]}
          >
            <div className="where global-where" onClick={() => setSelectedUser("all")}>Global Chat</div>
            {users.filter(u => u.username !== authUser()!.username).map((user, i, a) => (
              <div className={"where" + (i === a.length - 1 ? " last-where" : "")} onClick={() =>
                user.username !== authUser()!.username ? setSelectedUser(user.username) : "all"}
                onTouchStart={() =>
                  user.username !== authUser()!.username ? setSelectedUser(user.username) : "all"}
              >
                {user.username}
              </div>
            ))}


          </Popup>
        </div>
        {/* <ScrollToBottom className="chat-body" checkInterval={17}> */}
        <div className="chat-body">
          {
            messageHistory.map(v => (
              v.isDirect ?
                (v.from === authUser()!.username || v.to === authUser()!.username) ?
                  <div className="dm-wrapper">
                    {
                      v.from === authUser()!.username ?
                        (
                          <p className="whisper">
                            You whispered {v.message} to {v.to}
                          </p>
                        )
                        :
                        (
                          <p className="whisper">
                            {v.from} whispered {v.message} to you
                          </p>
                        )
                    }
                  </div>
                  : ""
                :
                <div className={`message-wrapper ${v.author === authUser()!.username ? "right" : "left"}`}>
                  <div className={`message`}>
                    {v.message}
                  </div>
                  <div className="author">
                    {v.author}
                  </div>
                </div>
            ))
          }
        </div>
        {/* </ScrollToBottom> */}
        <div className="chat-footer">
          <form className="chat-form" onSubmit={sendMessage} >
            <input className="message-box" type="text" id="message" name="message" placeholder={`Send a message to ${selectedUser}`} />
            <button className="send-message" type="submit">Send</button>
          </form>
        </div>
      </div>
    </Draggable>
  )
}