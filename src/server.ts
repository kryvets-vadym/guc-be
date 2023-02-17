import express, { Express } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRouter';
import commentsRouter from './routes/commentsRouter';
import { errorMiddleware } from './middlewares/errorMiddleware';
import * as dotenv from 'dotenv';
import { ApiError } from './exceptions/apiError';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use('/api', authRouter);
app.use('/api', commentsRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    const { DB_URL } = process.env;

    if (!DB_URL) {
      throw ApiError.NotFound();
    }

    await mongoose.connect(DB_URL);

    app.listen(PORT, () => console.log(`⚡️[server]: Server started on port ${PORT}`));
  } catch (e) {
    console.log(e)
  }
};

start();
