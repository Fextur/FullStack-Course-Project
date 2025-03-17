import mongoose from "mongoose";
import ChatMessage, { IChatMesaege } from "../models/chatMessage";
import ChatUser from "../models/chatUser";
import User from "../models/userModel";

type returnedMessage = {
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
          unreadCount: 1,
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
        sender: sender
      });

      await newMessage.save();

      return {
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
  ) {
    try {
      const skip = (page - 1) * limit;

      const messages = await ChatMessage.find({
        receiver: { $in: [userId, otherUserId] },
      })
        .skip(skip)
        .limit(limit)
        .populate("receiver", "_id email username image")
        .populate("sender", "_id email username image")
        .exec();

      const parsedMessages = messages.map((message) => {
        return {
          id: message._id.toString(),
          message: message.message,
          receiver: {
            id: message.receiver._id,
            email: message.receiver.email,
            username: message.receiver.username,
            image: message.receiver.image,
          },
          sender: {
            id: message.sender._id,
            email: message.sender.email,
            username: message.sender.username,
            image: message.sender.image,
          },
        };
      });

      return parsedMessages;
    } catch (error) {
      throw new Error("Error getting comments");
    }
  }
}

export default new chatMessageDao();
