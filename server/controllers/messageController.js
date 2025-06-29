import messages from "../models/messageModel.js";
import users from "../models/userModel.js";
import cloudinary from '../config/cloudinary.js'
import { io, userSocketMap } from "../index.js";

export const getUserForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;
    // Get all users except the current user
    const filteredUsers = await users
      .find({ _id: { $ne: userId } })
      .select("-password");
    
    // To store unseen message count per user (Fixed: correct property name)
    const unseenMessages = {};
    
    // For each user, find unseen messages sent to the current user
    const promises = filteredUsers.map(async (user) => {
      const unseenMsgs = await messages.find({
        senderId: user._id,
        receiverId: userId,
        seen: false,
      });
      if (unseenMsgs.length > 0) {
        unseenMessages[user._id] = unseenMsgs.length;
      }
    });
    
    // Wait for all DB queries to complete
    await Promise.all(promises);
    
    res.status(200).json({
      users: filteredUsers,
      unseenMessages, 
    });
  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: selectedUserId } = req.params; 
    const currentUser = req.user._id;
    
    const message = await messages.find({
      $or: [
        { senderId: currentUser, receiverId: selectedUserId },
        { senderId: selectedUserId, receiverId: currentUser },
      ],
    });
        await messages.updateMany(
      {
        senderId: selectedUserId,
        receiverId: currentUser,
      },
      { seen: true }
    );
    
    res.status(200).json(message);
  } catch (error) {
    console.error("Get Messages Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  try {
    const { id } = req.params;
    await messages.findByIdAndUpdate(id, { seen: true });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Mark Message Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const sentMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const receiverId = req.params.id;
    const senderId = req.user._id;
    
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }
    
    const newMessage = await messages.create({
      senderId,
      receiverId,
      text,
      image: imageUrl
    });
    
    const receiverSocketId = userSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Send Message Error:", error.message);
    res.status(500).json({ message: error.message });
  }
};