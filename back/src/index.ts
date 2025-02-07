import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { mongoURI, PORT } from './constants/congif';

const app = express();

app.use(express.json());
app.use(cors());

mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('Error connecting to MongoDB:', error));

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, world! Express server running with MongoDB connection');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
