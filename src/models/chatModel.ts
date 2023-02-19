import mongoose from "mongoose";

const chatModel = new mongoose.Schema(
  {
    // 会话名称
    chatName: { type: String, trim: true },
    // 是否是群聊
    isGroupChat: { type: Boolean, default: false },
    // 参与人员
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    // 最后一条消息，用于显示简略信息
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    // 群聊管理员
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Chat = mongoose.model("Chat", chatModel);

export default Chat;
