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
    methods: ["GET", "POST", "PATCH", "DELETE"],
  }
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "DELETE"],
}));

app.use(express.json());
app.use(SignupRoute);
app.use(LoginRoute);
app.use(GetUserRoute);
app.use(CharacterRoute);

let rooms: {
  id: string,
  users: { _id: string, username: string, isDM: boolean, disconnectTimeout?: NodeJS.Timeout }[],
  messages: { author?: string, message: string, isDirect: boolean, to?: string, from?: string }[]
  mapData: { src: string, name: string, id: string, x: number, y: number }[],
}[] = [];

io.on("connection", socket => {
  console.log(socket.id);
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
        disconnectTimeout: undefined,
      }],
      messages: [],
      mapData: [],
    });

    const rm = rooms.find(v => v.id === data.room);

    io.to(data.room).to(socket.id).emit("recieve_users", rm?.users);

  });

  // Join a room that EXISTS
  socket.on("join_room", (data) => {
    const room = rooms.find(({ id }) => id === data.room);

    if (room === undefined) return socket.emit("invalid_room");

    socket.join(data.room);

    const userInRoom = room.users.find(({ username }) => username === data.username)!;
    if (userInRoom !== undefined) {
      userInRoom._id = socket.id;
      if (userInRoom.disconnectTimeout !== undefined) {
        clearTimeout(userInRoom.disconnectTimeout);
        userInRoom.disconnectTimeout = undefined;
      }
      io.to(data.room).emit("recieve_users", room.users);
      io.to(data.room).to(socket.id).emit("recieve_messages", room.messages);
      io.to(data.room).to(socket.id).emit("recieve_map", room.mapData);
      return;
    }

    room.users.push({
      _id: socket.id,
      username: data.username,
      isDM: false,
      disconnectTimeout: undefined,
    });

    io.to(data.room).emit("recieve_users", room.users);
    io.to(data.room).to(socket.id).emit("recieve_messages", room.messages);
    io.to(data.room).to(socket.id).emit("recieve_map", room.mapData);
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

  socket.on("token_array_update", (data) => {
    const room = rooms.find((v) => v.id === data.room);
    room?.mapData.push(data.image);
    socket.to(data.room).emit("receive_map_update", room?.mapData);
  });

  socket.on("update_on_img_drag_end", (data) => { // src, name, id, x, y
    const room = rooms.find((v) => v.id === data.room);
    const img = room?.mapData.find((v) => v.id === data.data.identifier[0] && v.name === data.data.identifier[1]);
    setTimeout(() => {
      if (img) {
        img.x = data.data.x;
        img.y = data.data.y;

        socket.to(data.room).emit("receive_update_on_img_drag_end", room?.mapData);
      }
    }, 250);
  });

  socket.on("disconnect", (r) => {
    const roomsUserIsIn = rooms.filter(rm => rm.users.find(u => u._id === socket.id) !== undefined);
    for (const room of roomsUserIsIn) {
      const usr = room.users.find(v => v._id === socket.id)!;
      usr.disconnectTimeout = setTimeout(() => {
        room.users.splice(
          room.users.findIndex(u => u._id === socket.id),
          1
        );
        socket.leave(room.id);
        io.to(room.id).emit("recieve_users", room.users);

      }, 30 * 1000);
    }
  });

});

server.listen(3002, () => console.log("Backend started on port 3002"));