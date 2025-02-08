import { Schema, model } from "mongoose";

export interface IUser extends Document {
    email: string;
    username: string;
    password: string;
    image?: string;
}

const userSchema = new Schema(
    {
        email: { type: String, required: true, unique: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true, unique: true },
        image: { type: String, default: ''}
    },
    { collection: "Users" }
  );

const User = model<IUser>('User', userSchema);

export default User;
