import express from "express";
import { chats } from "./data/data";
import dotEnv from "dotenv";
import connectDB from "./config/db";
import colors from "colors";
import userRouters from "./routes/userRoutes";
import { notFound, errorHandler } from "./middleware/authMiddleware";

// 加载 .env 文件
dotEnv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/user", userRouters);

app.use(notFound);
app.use(errorHandler);

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
app.listen(port, () =>
  console.log(colors.yellow.bold(`Server is listen at port ${port}`))
);
