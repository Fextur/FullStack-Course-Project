import mongoose from "mongoose";
import ChatMessage from "../models/chatMessage";
import ChatUser from "../models/chatUser";
import User from "../models/userModel";

type returnedMessage = {
  id: string;
  message: string;
  receiverId: string;
  senderId: string;
  dateTime: Date;
};

class chatMessageDao {
  async createMessage(
    senderId: string,
    receiverId: string,
    message: string
  ): Promise<returnedMessage> {
    try {
      const receiver = await User.findById(receiverId).populate(
        "chatUsers",
        "user"
      );
      const sender = await User.findById(senderId);
      const senderObjectId = new mongoose.Types.ObjectId(senderId);

      const existingChatUser = receiver?.chatUsers.find((chatUser) =>
        senderObjectId.equals(chatUser.user._id)
      );

      if (existingChatUser) {
        await ChatUser.findOneAndUpdate(
          { _id: existingChatUser._id },
          {
            $inc: { unreadCount: 1 },
            $set: { lastMessage: message },
          }
        );
      }

      if (!existingChatUser) {
        const recieverChatUser = new ChatUser({
          lastMessage: "",
          unreadCount: 0,
          user: receiver,
        });

        const savedReciever = await recieverChatUser.save();
        sender?.chatUsers.push(savedReciever);

        await sender?.save();

        const senderChatUser = new ChatUser({
          lastMessage: message,
          unreadCount: 0,
          user: sender,
        });
        const savedSender = await senderChatUser.save();
        receiver?.chatUsers.push(savedSender);

        await receiver?.save();
      }

      const newMessage = new ChatMessage({
        message: message,
        receiver: receiver,
        sender: sender,
      });

      await newMessage.save();

      return {
        id: newMessage._id.toString(),
        message: newMessage.message,
        receiverId: newMessage.receiver._id,
        senderId: newMessage.sender._id,
        dateTime: newMessage.dateTime,
      };
    } catch (error) {
      console.error(error);
      throw new Error("Error getting messages");
    }
  }

  async getAllMessages(
    userId: string,
    otherUserId: string,
    page: number,
    limit: number
  ): Promise<returnedMessage[]> {
    try {
      const skip = (page - 1) * limit;

      const messages = await ChatMessage.find({
        $or: [
          { receiver: userId, sender: otherUserId },
          { receiver: otherUserId, sender: userId },
        ],
      })
        .skip(skip)
        .limit(limit)
        .sort({ dateTime: -1 })
        .exec();

      const parsedMessages = messages.map((message) => {
        return {
          id: message._id.toString(),
          message: message.message,
          receiverId: message.receiver._id,
          senderId: message.sender._id,
          dateTime: message.dateTime,
        };
      });

      return parsedMessages;
    } catch (error) {
      throw new Error("Error getting messages");
    }
  }
}

export default new chatMessageDao();
