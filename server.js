import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import { getUser, joinUser, getRoomUsers, userLeave } from "./utils/users.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

const io = new Server(server);
const getTime = () => moment().format("h:mm a");

io.on("connection", (socket) => {
  socket.on("join", (data) => {
    joinUser(socket.id, data.username, data.room);

    socket.emit("msg", {
      message: `welcome ${data.username} to ${data.room} room`,
      time: getTime(),
    });

    socket.join(data.room);

    socket.broadcast.to(data.room).emit("msg", {
      message: `${data.username} joined the room`,
      time: getTime(),
    });

    io.to(data.room).emit("roomUsers", {
      room: data.room,
      users: getRoomUsers(data.room),
    });
  });

  socket.on("send-message", ({ room, username, message }) => {
    io.to(room).emit("recieve-message", { username, message, time: getTime() });
  });

  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      socket.broadcast.to(user.room).emit("msg", {
        message: `${user.username} left the room`,
        time: getTime(),
      });
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

server.listen(3000, () => {
  console.log("server is running at port 3000");
});
