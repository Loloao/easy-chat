"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const messageControllers_1 = require("../controllers/messageControllers");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.protect, messageControllers_1.sendMessage);
router.route("/:chatId").get(authMiddleware_1.protect, messageControllers_1.allMessages);
exports.default = router;
