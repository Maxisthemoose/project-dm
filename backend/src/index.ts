import express from "express";
const app = express();

import http from "http";
const server = http.createServer(app);

import cors from "cors";
import { Server } from "socket.io";
import "./database/index";
import SignupRoute from "./routes/signup";
import LoginRoute from "./routes/login";
import GetUserRoute from "./routes/user";
import CharacterRoute from "./routes/character";

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PATCH"],
  }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH"],
}));

app.use(express.json());
app.use(SignupRoute);
app.use(LoginRoute);
app.use(GetUserRoute);
app.use(CharacterRoute);

let rooms: {
  id: string,
  users: { _id: string, username: string, email: string, isDM: boolean }[],
  messages: { author?: string, message: string, isDirect: boolean, to?: string, from?: string }[]
}[] = [];

io.on("connection", socket => {
  console.log("User connected");
  socket.on("join", data => {

    socket.join(data.room);

    const roomExists = rooms.find(v => v.id === data.room);
    if (roomExists !== undefined) {
      const userExists = roomExists.users.find(user => user.username === data.username && user.email === data.email);
      if (userExists === undefined)
        roomExists.users.push({
          email: data.email,
          username: data.username,
          isDM: false,
          _id: socket.id,
        });
    } else
      rooms.push({
        id: data.room,
        users: [{
          username: data.username,
          email: data.email,
          isDM: true,
          _id: socket.id,
        }],
        messages: [],
      });

    io.to(data.room).emit("get_messages", data.room);
    io.to(data.room).emit("get_users", data.room);

  });



  socket.on("get_users", (room_id) => {
    io.to(room_id).emit("recieve_users", rooms.find(r => r.id === room_id));
  });

  socket.on("get_messages", (room_id) => {
    const room = rooms.find(r => r.id === room_id);
    if (!room) return;
    const messages = room.messages!;
    io.to(room_id).emit("recieve_messages", messages);
    // io.to(socket.id).emit("recieve_messages", messages);
  });


  socket.on("leave", (roomId) => {
    socket.leave(roomId);

    const room = rooms.find(v => v.id === roomId);
    if (room) {
      const index = room.users.findIndex(u => u._id === socket.id);
      if (index !== -1)
        room.users.splice(index, 1);
    }
  });

  socket.on("disconnect", (r) => {
    console.log("Socket disconnected")
    const rm = rooms.filter(rm => rm.users.find(u => u._id === socket.id) !== undefined);
    for (const room of rm) {
      room.users.splice(room.users.findIndex(u => u._id === socket.id), 1);
      socket.leave(room.id);
      io.to(room.id).emit("recieve_users", room);
    }
  });

  socket.on("send_dm", data => {
    const room = rooms.find(r => r.id === data.room)
    room?.messages.push({
      isDirect: true,
      message: data.message,
      to: data.to,
      from: data.from,
    });

    socket.to(data._id).emit("recieve_dm", {
      isDirect: true,
      message: data.message,
      to: data.to,
      from: data.from,
    });
  });

  socket.on("message_send", data => {
    const room = rooms.find(r => r.id === data.room);
    room?.messages.push({
      author: data.author,
      message: data.message,
      isDirect: false,
    });
  });

  socket.on("map_update", (data) => {
    socket.to(data.room).emit("map_update", data.data);
  });

})

server.listen(3001, () => console.log("Backend started on port 3001"));