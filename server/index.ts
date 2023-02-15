import express from "express";
import dotEnv from "dotenv";
import connectDB from "./config/db";
import colors from "colors";
import userRouters from "./routes/userRoutes";
import chatRouters from "./routes/chatRoutes";
import messageRouters from "./routes/messageRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";
import { Server } from "socket.io";
import {} from "../shared/index.ts";

// 加载 .env 文件
dotEnv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/user", userRouters);
app.use("/api/chat", chatRouters);
app.use("/api/message", messageRouters);

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

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
});
