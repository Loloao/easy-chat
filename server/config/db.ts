import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI!);
    console.log(colors.cyan(`MongoDB 已连接 ${connect.connection.host}`));
  } catch (err) {
    console.log(`MongoDB Connection Error: ${err}`);
    process.exit();
  }
};

export default connectDB;
