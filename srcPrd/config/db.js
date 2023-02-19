"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const colors_1 = __importDefault(require("colors"));
const connectDB = async () => {
    mongoose_1.default.set("strictQuery", true);
    try {
        const connect = await mongoose_1.default.connect(process.env.MONGO_URI);
        console.log(colors_1.default.cyan(`MongoDB 已连接 ${connect.connection.host}`));
    }
    catch (err) {
        console.log(`MongoDB Connection Error: ${err}`);
        process.exit();
    }
};
exports.default = connectDB;
