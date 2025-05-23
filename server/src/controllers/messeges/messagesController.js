import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/messages/Chat.js";
import Message from "../../models/messages/MessageSchema.js";
import User from "../../models/auth/UserModel.js";

export const createChat = expressAsyncHandler(async (req, res) => {
  try {
    const newChat = new Chat({
      participants: [req.body.senderId, req.body.receiverId],
    });

    const chat = await newChat.save();

    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a group chat
export const createGroupChat = expressAsyncHandler(async (req, res) => {
  try {
    const { name, participants, groupAdmin } = req.body;
    if (!name || !participants || participants.length < 2) {
      return res.status(400).json({ message: "Group name and at least 2 members are required" });
    }
    const groupChat = new Chat({
      isGroup: true,
      name,
      participants,
      groupAdmin,
    });
    const chat = await groupChat.save();
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add user(s) to group
export const addToGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userIds } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { participants: { $each: userIds } } },
      { new: true }
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Remove user from group
export const removeFromGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, userId } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { participants: userId } },
      { new: true }
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rename group
export const renameGroup = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, name } = req.body;
    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { name },
      { new: true }
    );
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get group chat details
export const getGroupDetails = expressAsyncHandler(async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate("participants", "_id name photo")
      .populate("groupAdmin", "_id name photo");
    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "Group chat not found" });
    }
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export const getAllUserChats = expressAsyncHandler(async (req, res) => {
  try {
    const chat = await Chat.find({
      // find all chats where the user is a participant in.
      participants: { $in: [req.params.userId] },
    }).sort({ lastModified: -1 });

    res.status(200).json(chat);
  } catch (error) {
    console.log("Error in getAllUserChats", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const createMessage = expressAsyncHandler(async (req, res) => {
  try {
    const newMessage = new Message(req.body);

    const message = await newMessage.save();
    // update the last modified date of the chat
    await Chat.findByIdAndUpdate(req.body.chatId, {
      lastModified: Date.now(),
    });

    res.status(200).json(message);
  } catch (error) {
    console.log("Error in createMessage", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getChatMessages = expressAsyncHandler(async (req, res) => {
  //const { limit, offset } = req.query;
  //const limitNumber = parseInt(limit, 10) || 20;
  //const offsetNumber = parseInt(offset, 10) || 0;

  try {
    const messgaes = await Message.find({ chatId: req.params.chatId });
    //.sort({ createdAt: -1 })
    //.limit(limitNumber)
    //.skip(offsetNumber);

    res.status(200).json(messgaes);
  } catch (error) {
    console.log("Error in getChatMessages", error.message);
    res.status(500).json({ message: error.message });
  }
});

// get user by id
export const getUserById = expressAsyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserById", error.message);
    res.status(500).json({ message: error.message });
  }
});
