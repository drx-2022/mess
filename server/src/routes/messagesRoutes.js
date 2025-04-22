import express from "express";
import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
  getUserById,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  renameGroup,
  getGroupDetails,
} from "../controllers/messeges/messagesController.js";
import { transferAdmin } from "../controllers/messeges/transferAdminController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/chats", protect, createChat);
router.get("/chats/:userId", protect, getAllUserChats);

// Group chat routes
router.post("/group", protect, createGroupChat);
router.put("/group/add", protect, addToGroup);
router.put("/group/remove", protect, removeFromGroup);
router.put("/group/rename", protect, renameGroup);
router.put("/group/transfer-admin", protect, transferAdmin);
router.get("/group/:chatId", protect, getGroupDetails);

// Messages
router.post("/message", protect, createMessage);
router.get("/messages/:chatId", protect, getChatMessages);

// get user by id
router.get("/user/:id", protect, getUserById);

export default router;
