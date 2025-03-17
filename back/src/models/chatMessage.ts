import mongoose, { Schema, model } from "mongoose";
import { IUser } from "./userModel";

export interface IChatMesaege extends Document {
  _id: mongoose.Types.ObjectId;
  message: string;
  receiver: IUser;
  sender: IUser;
  dateTime: Date;
}

const chatMesaegeSchema = new Schema(
  {
    message: { type: String, required: true },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateTime: { type: Date, required: true, default: Date.now },
  },
  { collection: "ChatMesaeges", timestamps: false }
);

const ChatMesaege = model<IChatMesaege>("ChatMesaege", chatMesaegeSchema);

export default ChatMesaege;
