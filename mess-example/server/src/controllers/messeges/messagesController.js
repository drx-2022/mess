import expressAsyncHandler from "express-async-handler"
import Chat from "../../models/messages/Chat.js"
import Message from "../../models/messages/MessageSchema.js"
import User from "../../models/auth/UserModel.js"

export const createChat = expressAsyncHandler(async (req, res) => {
  try {
    const newChat = new Chat({
      participants: [req.body.senderId, req.body.receiverId],
    })

    const chat = await newChat.save()

    res.status(200).json(chat)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export const createGroupChat = expressAsyncHandler(async (req, res) => {
  try {
    const { name, participants, adminId, groupPhoto } = req.body

    if (!name || !participants || !adminId) {
      return res.status(400).json({ message: "Please provide all required fields" })
    }

    // Remove duplicate participants
    const uniqueParticipants = [...new Set(participants)]

    // Create new group chat
    const newGroupChat = new Chat({
      groupName: name,
      participants: uniqueParticipants,
      groupAdmin: adminId,
      isGroup: true,
      groupPhoto: groupPhoto || "https://xsgames.co/randomusers/assets/avatars/pixel/1.jpg",
    })

    const groupChat = await newGroupChat.save()

    res.status(201).json(groupChat)
  } catch (error) {
    console.log("Error in createGroupChat", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const addToGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body

    // Check if chat exists
    const chat = await Chat.findById(chatId)
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Check if user is already in the group
    if (chat.participants.includes(userId)) {
      return res.status(400).json({ message: "User already in group" })
    }

    // Add user to group
    chat.participants.push(userId)
    await chat.save()

    res.status(200).json(chat)
  } catch (error) {
    console.log("Error in addToGroup", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const removeFromGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body

    // Check if chat exists
    const chat = await Chat.findById(chatId)
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Check if user is in the group
    if (!chat.participants.includes(userId)) {
      return res.status(400).json({ message: "User not in group" })
    }

    // Remove user from group
    chat.participants = chat.participants.filter((id) => id.toString() !== userId)
    await chat.save()

    res.status(200).json(chat)
  } catch (error) {
    console.log("Error in removeFromGroup", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const updateGroupInfo = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, groupName, groupPhoto } = req.body

    // Check if chat exists
    const chat = await Chat.findById(chatId)
    if (!chat) {
      return res.status(404).json({ message: "Chat not found" })
    }

    // Update group info
    if (groupName) chat.groupName = groupName
    if (groupPhoto) chat.groupPhoto = groupPhoto

    await chat.save()

    res.status(200).json(chat)
  } catch (error) {
    console.log("Error in updateGroupInfo", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const getAllUserChats = expressAsyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find({
      // find all chats where the user is a participant in.
      participants: { $in: [req.params.userId] },
    }).sort({ lastModified: -1 })

    res.status(200).json(chat)
  } catch (error) {
    console.log("Error in getAllUserChats", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const createMessage = expressAsyncHandler(async (req, res) => {
  try {
    const newMessage = new Message(req.body)

    const message = await newMessage.save()
    // update the last modified date of the chat
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastModified: Date.now(),
    })

    res.status(200).json(message)
  } catch (error) {
    console.log("Error in createMessage", error.message)
    res.status(500).json({ message: error.message })
  }
})

export const getChatMessages = expressAsyncHandler(async (req, res) => {
  //const { limit, offset } = req.query;
  //const limitNumber = parseInt(limit, 10) || 20;
  //const offsetNumber = parseInt(offset, 10) || 0;

  try {
    const messgaes = await Message.find({ chatId: req.params.chatId })
    //.sort({ createdAt: -1 })
    //.limit(limitNumber)
    //.skip(offsetNumber);

    res.status(200).json(messgaes)
  } catch (error) {
    console.log("Error in getChatMessages", error.message)
    res.status(500).json({ message: error.message })
  }
})

// get user by id
export const getUserById = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password")

    if (!user) {
      res.status(404).json({ message: "User not found" })
    }

    res.status(200).json(user)
  } catch (error) {
    console.log("Error in getUserById", error.message)
    res.status(500).json({ message: error.message })
  }
})
