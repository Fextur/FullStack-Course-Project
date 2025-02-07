import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3000;
export const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase';
