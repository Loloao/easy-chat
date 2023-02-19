"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allMessages = exports.sendMessage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const messageModel_1 = __importDefault(require("../models/messageModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const sendMessage = (0, express_async_handler_1.default)(async (req, res) => {
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
        let message = await messageModel_1.default.create(newMessage);
        message = await message.populate("sender", "name pic");
        message = await message.populate("chat");
        const messageUser = await userModel_1.default.populate(message, {
            path: "chat.users",
            select: "name pic email",
        });
        await chatModel_1.default.findByIdAndUpdate(req.body.chatId, {
            latestMessage: messageUser,
        });
        res.json(messageUser);
    }
    catch (error) {
        res.status(400);
        if (error instanceof Error)
            throw new Error(error.message);
    }
});
exports.sendMessage = sendMessage;
const allMessages = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        const messages = await messageModel_1.default.find({ chat: req.params.chatId })
            .populate("sender", "name pic email")
            .populate("chat");
        res.json(messages);
    }
    catch (error) {
        res.status(400);
        if (error instanceof Error)
            throw new Error(error.message);
    }
});
exports.allMessages = allMessages;
