import User, { IUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';

class UserDao {
  async createUser(userData: { email: string; username: string; image?: string }): Promise<HydratedDocument<IUser>> {
    const newUser = new User(userData);
    return newUser.save();
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async updateUserByEmail(email: string, updatedData: { username?: string; image?: string }): Promise<IUser | null> {
    return User.findOneAndUpdate({ email }, updatedData, { new: true });
  }

  async deleteUserByEmail(email: string): Promise<IUser | null> {
    return User.findOneAndDelete({ email });
  }
}

export default new UserDao();
