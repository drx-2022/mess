import express from "express"
import {
  createChat,
  createMessage,
  getAllUserChats,
  getChatMessages,
  getUserById,
  createGroupChat,
  addToGroup,
  removeFromGroup,
  updateGroupInfo,
} from "../controllers/messeges/messagesController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

router.post("/chats", protect, createChat)
router.get("/chats/:userId", protect, getAllUserChats)

// Group chat routes
router.post("/group-chat", protect, createGroupChat)
router.put("/group-chat/add", protect, addToGroup)
router.put("/group-chat/remove", protect, removeFromGroup)
router.put("/group-chat/update", protect, updateGroupInfo)

// Messages
router.post("/message", protect, createMessage)
router.get("/messages/:chatId", protect, getChatMessages)

// get user by id
router.get("/user/:id", protect, getUserById)

export default router
