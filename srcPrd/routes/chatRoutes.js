"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatControllers_1 = require("../controllers/chatControllers");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
router.route("/").post(authMiddleware_1.protect, chatControllers_1.accessChat);
router.route("/").get(authMiddleware_1.protect, chatControllers_1.fetchChats);
router.route("/group").post(authMiddleware_1.protect, chatControllers_1.createGroupChat);
router.route("/rename").put(authMiddleware_1.protect, chatControllers_1.renameGroup);
router.route("/groupadd").put(authMiddleware_1.protect, chatControllers_1.addToGroup);
router.route("/groupremove").put(authMiddleware_1.protect, chatControllers_1.removeFromGroup);
exports.default = router;
