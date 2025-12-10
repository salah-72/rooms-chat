import express from "express";
import { Server } from "socket.io";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "public")));
const server = http.createServer(app);

const io = new Server(server);
const getTime = () => moment().format("h:mm a");

io.on("connection", (socket) => {
  console.log(socket.id);

  socket.on("join", (data) => {
    socket.emit("msg", {
      message: `welcome ${data.username} to ${data.room} room`,
      time: getTime(),
    });

    socket.join(data.room);

    socket.broadcast.to(data.room).emit("msg", {
      message: `${data.username} joined the room`,
      time: getTime(),
    });

    socket.on("disconnect", () => {
      socket.broadcast.to(data.room).emit("msg", {
        message: `${data.username} left the room`,
        time: getTime(),
      });
    });
  });

  socket.on("send-message", ({ room, username, message }) => {
    io.to(room).emit("recieve-message", { username, message, time: getTime() });
  });
});

server.listen(3000, () => {
  console.log("server is running at port 3000");
});
