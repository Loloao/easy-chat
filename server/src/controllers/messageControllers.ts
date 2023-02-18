import asyncHandler from "express-async-handler";
import Chat from "../models/chatModel";
import Message from "../models/messageModel";
import User from "../models/userModel";

const sendMessage = asyncHandler(async (req, res) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    res.sendStatus(400);
    return;
  }

  const newMessage = {
    sender: req.body.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    const messageUser = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: messageUser,
    });

    res.json(messageUser);
  } catch (error) {
    res.status(400);
    if (error instanceof Error) throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    res.json(messages);
  } catch (error) {
    res.status(400);
    if (error instanceof Error) throw new Error(error.message);
  }
});

export { sendMessage, allMessages };
