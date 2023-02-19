"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_TOKEN);
            req.body.user = await userModel_1.default.findById(decoded.id).select("-password");
            next();
        }
        catch (error) {
            res.status(401);
            throw new Error("无法验证用户，请登录");
        }
    }
    if (!token) {
        res.status(401);
        throw new Error("用户 token 验证失败");
    }
});
exports.protect = protect;
