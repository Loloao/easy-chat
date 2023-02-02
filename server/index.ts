import express from "express";
import dotEnv from "dotenv";
import connectDB from "./config/db";
import colors from "colors";
import userRouters from "./routes/userRoutes";
import chatRouters from "./routes/chatRoutes";
import { notFound, errorHandler } from "./middleware/errorMiddleware";

// 加载 .env 文件
dotEnv.config();

connectDB();

const app = express();

app.use(express.json());

app.use("/api/user", userRouters);
app.use("/api/chat", chatRouters);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8001;
app.listen(port, () =>
  console.log(colors.yellow.bold(`Server is listen at port ${port}`))
);
