"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatModel = new mongoose_1.default.Schema({
    // 会话名称
    chatName: { type: String, trim: true },
    // 是否是群聊
    isGroupChat: { type: Boolean, default: false },
    // 参与人员
    users: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    // 最后一条消息，用于显示简略信息
    latestMessage: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Message",
    },
    // 群聊管理员
    groupAdmin: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    timestamps: true,
});
const Chat = mongoose_1.default.model("Chat", chatModel);
exports.default = Chat;
