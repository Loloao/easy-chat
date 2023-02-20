import express from "express";
import dotEnv from "dotenv";
import colors from "colors";
import { Server } from "socket.io";
import path from "path";

import userRouters from "./routes/userRoutes";
import chatRouters from "./routes/chatRoutes";
import messageRouters from "./routes/messageRoutes";
import connectDB from "./config/db";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { SOCKET_EVENT } from "./constants/enums";
import { Message, User } from "./constants/types";

// 加载 .env 文件
dotEnv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/user", userRouters);
app.use("/api/chat", chatRouters);
app.use("/api/message", messageRouters);

// ------------- Deployment ------------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "public")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "public", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully???");
  });
}
// ------------- Deployment ------------------

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8001;
const server = app.listen(port, () =>
  console.log(colors.yellow.bold(`Server is listen at port ${port}`))
);

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_ADDRESS,
  },
});
const {
  CONNECTED,
  SET_UP,
  MESSAGE_RECEIVED,
  CONNECTION,
  JOIN_CHAT,
  NEW_MESSAGE,
} = SOCKET_EVENT;

io.on(CONNECTION, (socket) => {
  console.log("connected to socket.io");
  socket.on(SET_UP, (userData) => {
    socket.join(userData._id);
    socket.emit(CONNECTED);
  });

  socket.on(JOIN_CHAT, (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });

  socket.on(NEW_MESSAGE, (newMessageRecieved: Message) => {
    const chat = newMessageRecieved.chat;
    console.log("user send newMessage", newMessageRecieved.content);

    if (!chat.users) return console.log("users not found");

    socket.to(chat._id).emit(MESSAGE_RECEIVED, newMessageRecieved);

    // chat.users.forEach((v: User) => {
    //   if (v._id === newMessageRecieved.sender._id) return;
    //   console.log(v, "vvv");
    //   socket.in(v._id).emit(MESSAGE_RECEIVED, newMessageRecieved);
    // });
  });

  socket.off(SET_UP, (userData) => {
    socket.leave(userData._id);
  });
});
