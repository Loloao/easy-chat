"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFromGroup = exports.addToGroup = exports.renameGroup = exports.fetchChats = exports.accessChat = exports.createGroupChat = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const chatModel_1 = __importDefault(require("../models/chatModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const accessChat = (0, express_async_handler_1.default)(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.sendStatus(400);
        return;
    }
    let lastChat = await chatModel_1.default.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.body.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ],
    })
        .populate("users", "-password")
        .populate("latestMessage");
    const isChat = await userModel_1.default.populate(lastChat, {
        path: "latestMaessage.sender",
        select: "name pic email",
    });
    if (isChat.length > 0) {
        res.send(isChat[0]);
    }
    else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.body.user._id, userId],
        };
        try {
            const createdChat = await chatModel_1.default.create(chatData);
            const FullChat = await chatModel_1.default.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(FullChat);
        }
        catch (err) {
            res.status(400);
            // fix err unknow
            if (err instanceof Error) {
                throw new Error(err.message);
            }
        }
    }
});
exports.accessChat = accessChat;
const fetchChats = (0, express_async_handler_1.default)(async (req, res) => {
    try {
        chatModel_1.default.find({ users: { $elemMatch: { $eq: req.body.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
            const result = await userModel_1.default.populate(results, {
                path: "latestMessage.sender",
                select: "name pic email",
            });
            res.status(200).send(result);
        });
    }
    catch (err) {
        res.status(400);
        if (err instanceof Error)
            throw new Error(err.message);
    }
});
exports.fetchChats = fetchChats;
const createGroupChat = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        res.status(400).send({ message: "请填写所有表单" });
        return;
    }
    const users = JSON.parse(req.body.users);
    if (users.length < 2) {
        res.status(400).send("聊天群需要额外两个以上的用户");
        return;
    }
    users.push(req.body.user);
    try {
        const groupChat = await chatModel_1.default.create({
            chatName: req.body.name,
            users,
            isGroupChat: true,
            groupAdmin: req.body.user,
        });
        const fullGroupChat = await chatModel_1.default.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");
        res.status(200).json(fullGroupChat);
    }
    catch (err) {
        res.status(400);
        if (err instanceof Error)
            throw new Error(err.message);
    }
});
exports.createGroupChat = createGroupChat;
const renameGroup = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await chatModel_1.default.findByIdAndUpdate(chatId, { chatName }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!updatedChat) {
        res.status(404);
        throw new Error("会话未找到");
    }
    else {
        res.status(200).json(updatedChat);
    }
});
exports.renameGroup = renameGroup;
const addToGroup = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const added = await chatModel_1.default.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!added) {
        res.status(404);
        throw new Error("未找到会话");
    }
    else {
        res.json(added);
    }
});
exports.addToGroup = addToGroup;
const removeFromGroup = (0, express_async_handler_1.default)(async (req, res) => {
    const { chatId, userId } = req.body;
    const removed = await chatModel_1.default.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true })
        .populate("users", "-password")
        .populate("groupAdmin", "-password");
    if (!removed) {
        res.status(404);
        throw new Error("未找到会话");
    }
    else {
        res.json(removed);
    }
});
exports.removeFromGroup = removeFromGroup;
