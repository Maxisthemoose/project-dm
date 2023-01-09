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
  users: { _id: string, username: string, isDM: boolean }[],
  messages: { author?: string, message: string, isDirect: boolean, to?: string, from?: string }[]
}[] = [];

io.on("connection", socket => {

  // CREATE a new room
  socket.on("create_room", (data) => {

    const room = rooms.find(({ id }) => id === data.room);
    console.log("???");
    if (room !== undefined) return socket.emit("room_exists");

    socket.join(data.room);

    console.log("New Room Created by", data.username);

    rooms.push({
      id: data.room,
      users: [{
        username: data.username,
        isDM: true,
        _id: socket.id,
      }],
      messages: [],
    });

  });

  // Join a room that EXISTS
  socket.on("join_room", (data) => {
    const room = rooms.find(({ id }) => id === data.room);
    console.log("???");
    if (room === undefined) return socket.emit("invalid_room");

    socket.join(data.room);
    console.log("Room Joined by", data.username);

    const userInRoom = room.users.find(({ username }) => username === data.username)
    if (userInRoom !== undefined) return;

    room.users.push({
      _id: socket.id,
      username: data.username,
      isDM: false,
    });

    io.to(data.room).emit("recieve_users", room.users);
    io.to(data.room).to(socket.id).emit("recieve_messages", room.messages);

  });

  socket.on("send_message", (data) => {
    const room = rooms.find(({ id }) => id === data.room)!;
    const message = {
      isDirect: false,
      message: data.message,
      author: data.author,
    };

    room.messages.push(message);

    socket.to(data.room).emit("recieve_message", message);
  });

  socket.on("send_dm", data => {
    const room = rooms.find(r => r.id === data.room)!;
    room.messages.push({
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

  socket.on("disconnect", (r) => {
    const roomsUserIsIn = rooms.filter(rm => rm.users.find(u => u._id === socket.id) !== undefined);
    for (const room of roomsUserIsIn) {
      room.users.splice(
        room.users.findIndex(u => u._id === socket.id),
        1
      );
      socket.leave(room.id);
      io.to(room.id).emit("recieve_users", room.users);
    }
  });

});

server.listen(3002, () => console.log("Backend started on port 3002"));