// Transfer admin rights to another user in a group chat
import expressAsyncHandler from "express-async-handler";
import Chat from "../../models/messages/Chat.js";

export const transferAdmin = expressAsyncHandler(async (req, res) => {
  try {
    const { chatId, newAdminId } = req.body;
    const chat = await Chat.findById(chatId);
    if (!chat || !chat.isGroup) {
      return res.status(404).json({ message: "Group chat not found" });
    }
    // Only the current admin can transfer
    if (chat.groupAdmin.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Only the current admin can transfer admin rights." });
    }
    // New admin must be a participant
    if (!chat.participants.map(id => id.toString()).includes(newAdminId)) {
      return res.status(400).json({ message: "New admin must be a group member." });
    }
    chat.groupAdmin = newAdminId;
    await chat.save();
    // Optionally, emit a socket event here for live update
    res.status(200).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
