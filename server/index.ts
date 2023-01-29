import express from "express";
import { chats } from "./data/data";
import dotEnv from "dotenv";

// 加载 .env 文件
dotEnv.config();

const app = express();

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.get("/api/chats/:id", (req, res) => {
  const chat = chats.find((v) => {
    v._id === req.params.id;
  });
  res.send(chat);
});

const port = process.env.PORT || 8001;
app.listen(port, () => console.log("Server is listen at port " + port));
