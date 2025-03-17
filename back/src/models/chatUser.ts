import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./userModel";

export interface IChatUser extends Document {
  _id: mongoose.Types.ObjectId;
  lastMessage?: string;
  unreadCount: number;
  user: IUser;
  dateTime: Date;
}

const chatUserSchema = new Schema(
  {
    lastMessage: { type: String },
    unreadCount: { type: Number, required: true, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dateTime: { type: Date, required: true, default: Date.now },
  },
  { collection: "ChatUsers", timestamps: true }
);

const ChatUser = model<IChatUser>("ChatUser", chatUserSchema);

export default ChatUser;
