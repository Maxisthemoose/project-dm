import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useAuthUser } from "react-auth-kit";
import { useParams } from "react-router-dom";
import "./Chat.css";

export default function Chat({ socket, users, messages }: { socket: Socket; users: any[]; messages: any[] }) {
  const authUser = useAuthUser();
  const params = useParams();
  const [selectedUser, setSelectedUser] = useState("all");
  const [messageHistory, setMessageHistory] = useState(messages);
  const [chatOpen, setChatOpen] = useState(true);

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
      console.log(messages);
      setMessageHistory(messages);
      // socket.off("recieve_messages");
    });

    socket.on("recieve_dm", (data) => {
      setMessageHistory(old => [...old, data]);
    });

  }, []);


  return (
    <>
      <div className="chat-toolbar" onClick={() => setChatOpen(!chatOpen)}>
        X
      </div>
      {chatOpen ?
        <div className="chat-wrapper">
          <div className="chat-header">
            <div className="where" onClick={() => setSelectedUser("all")}>Global</div>
            {users.filter(u => u.username !== authUser()!.username).map(user => (
              <div className="where" onClick={() => user.username !== authUser()!.username ? setSelectedUser(user.username) : "all"}>{user.username}</div>
            ))}
          </div>
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
          <div className="chat-footer">
            <form className="chat-form" onSubmit={sendMessage} >
              <input className="message-box" type="text" id="message" name="message" placeholder={`Send a message to ${selectedUser}`} />
              <button className="send-message" type="submit">Send</button>
            </form>
          </div>
        </div>
        : ""}
    </>
  )
}