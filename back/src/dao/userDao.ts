import User, { IUser } from '../models/userModel';
import { HydratedDocument } from 'mongoose';

type updateDao = { 
  username?: IUser['username'] 
  image?: IUser['image'] 
  password?: IUser['password']
}

class UserDao {
  async createUser(userData: IUser): Promise<HydratedDocument<IUser>> {
    const newUser = new User(userData);
    return newUser.save();
  }

  async getUserByEmail(email: IUser['email']): Promise<IUser | null> {
    return User.findOne({ email });
  }

  async getUserByUsername(username: IUser['username']): Promise<IUser | null> {
    return User.findOne({ username });
  }

  async updateUserByEmail(email: IUser['email'], updatedData: updateDao): Promise<IUser | null> {
    return User.findOneAndUpdate({ email }, updatedData, { new: true });
  }

  async deleteUserByEmail(email: IUser['email']): Promise<IUser | null> {
    return User.findOneAndDelete({ email });
  }
}

export default new UserDao();
