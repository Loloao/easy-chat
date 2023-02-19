"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const colors_1 = __importDefault(require("colors"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const messageRoutes_1 = __importDefault(require("./routes/messageRoutes"));
const db_1 = __importDefault(require("./config/db"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const enums_1 = require("./constants/enums");
// 加载 .env 文件
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api/user", userRoutes_1.default);
app.use("/api/chat", chatRoutes_1.default);
app.use("/api/message", messageRoutes_1.default);
// ------------- Deploymeng ------------------
const __dirname1 = path_1.default.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname1, "public")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.resolve(__dirname1, "public", "index.html"));
    });
}
else {
    app.get("/", (req, res) => {
        res.send("API is Running Successfully???");
    });
}
// ------------- Deploymeng ------------------
app.use(errorMiddleware_1.notFound);
app.use(errorMiddleware_1.errorHandler);
const port = process.env.PORT || 8001;
const server = app.listen(port, () => console.log(colors_1.default.yellow.bold(`Server is listen at port ${port}`)));
const io = new socket_io_1.Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: process.env.CLIENT_ADDRESS,
    },
});
const { CONNECTED, SET_UP, MESSAGE_RECEIVED, CONNECTION, JOIN_CHAT, NEW_MESSAGE, } = enums_1.SOCKET_EVENT;
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
    socket.on(NEW_MESSAGE, (newMessageRecieved) => {
        const chat = newMessageRecieved.chat;
        if (!chat.users)
            return console.log("users not found");
        chat.users.forEach((v) => {
            if (v._id === newMessageRecieved.sender._id)
                return;
            socket.in(v._id).emit(MESSAGE_RECEIVED, newMessageRecieved);
        });
    });
    socket.off(SET_UP, (userData) => {
        socket.leave(userData._id);
    });
});
