import User, { IUser } from "../models/userModel";
import { HydratedDocument } from "mongoose";
import bcrypt from "bcrypt";

type updateDao = {
  username?: IUser["username"];
  image?: IUser["image"];
};

class UserDao {
  async createUser(userData: IUser): Promise<HydratedDocument<IUser>> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(userData.password, salt);

    const newUser = new User({ ...userData, password: hashedPassword });
    return newUser.save();
  }

  async getUserByUsername(
    username: IUser["username"]
  ): Promise<Omit<IUser, "password"> | null> {
    return User.findOne({ username }).select("-password");
  }

  async updateUserByEmail(
    email: IUser["email"],
    updatedData: updateDao
  ): Promise<IUser | null> {
    return User.findOneAndUpdate({ email }, updatedData, { new: true });
  }
}

export default new UserDao();
