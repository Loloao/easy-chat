"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.allUsers = exports.authUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../config/generateToken"));
const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, email, password, pic } = req.body;
    if (!name || !email || !password) {
        res.status(400);
        throw new Error("请输入所有表单");
    }
    const isUserExit = await userModel_1.default.findOne({ email });
    if (isUserExit) {
        res.status(400);
        throw new Error("用户已存在");
    }
    const user = await userModel_1.default.create({
        name,
        email,
        password,
        pic,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            password: user.password,
            pic: user.pic,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error("创建用户失败");
    }
});
exports.registerUser = registerUser;
const authUser = (0, express_async_handler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error("email 或密码错误");
    }
});
exports.authUser = authUser;
const allUsers = (0, express_async_handler_1.default)(async (req, res) => {
    const keyword = req.query.search
        ? {
            $or: [
                { name: { $regex: req.query.search, $options: "i" } },
                { email: { $regex: req.query.search, $options: "i" } },
            ],
        }
        : {};
    const users = await userModel_1.default.find(keyword).find({
        _id: { $ne: req.body.user._id },
    });
    res.send(users);
});
exports.allUsers = allUsers;
