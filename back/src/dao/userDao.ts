import User, { IUser } from "../models/userModel";
import bcrypt from "bcrypt";

type updateDao = {
  username?: IUser["username"];
  image?: IUser["image"];
  tokens?: string[];
};

export type returnedUser = {
  id: string;
  email: string;
  username: string;
  image?: string;
};

type returnedChatUser = {
  id: string;
  userId: string;
  username: string;
  email: string;
  image?: string;
  lastMessage?: string;
  unreadCount: number;
  dateTime: Date;
};

class UserDao {
  async createUser(userData: IUser): Promise<returnedUser> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({ ...userData, password: hashedPassword });
    const savedUser = await newUser.save();

    const { _id, email, username, image } = savedUser;

    return {
      id: _id.toString(),
      email,
      username,
      image,
    };
  }

  async getUserById(_id: IUser["_id"]): Promise<returnedUser | null> {
    const foundUser = await User.findOne({ _id })
      .select("-password -tokens -_id -__v")
      .lean();

    if (!foundUser) return foundUser;
    return {
      ...foundUser,
      id: _id,
    };
  }

  async updateUserById(
    _id: IUser["_id"],
    updatedData: updateDao
  ): Promise<returnedUser | null> {
    const updatedUser = await User.findOneAndUpdate({ _id }, updatedData, {
      new: true,
    });

    if (!updatedUser) return null;

    const {
      password,
      tokens,
      _id: __id,
      __v,
      ...userWithoutProps
    } = updatedUser.toObject();

    return {
      ...userWithoutProps,
      id: _id,
    };
  }

  async getChatUsers(_id: IUser["_id"]): Promise<returnedChatUser[] | null> {
    const user = await User.findById(_id)
      .populate("chatUsers", "id lastMessage unreadCount image user")
      .populate([
        {
          path: "chatUsers",
          populate: [{ path: "user" }],
        },
      ])
      .exec();

    if (!user) return null;
    else {
      const formatedChatUsers = user?.chatUsers.map((chatUser) => ({
        id: chatUser._id.toString(),
        userId: chatUser.user._id.toString(),
        username: chatUser.user.username,
        email: chatUser.user.email,
        image: chatUser.user.image,
        lastMessage: chatUser.lastMessage,
        unreadCount: chatUser.unreadCount,
        dateTime: chatUser.dateTime,
      }));

      return formatedChatUsers;
    }
  }
}

export default new UserDao();
