import express, { Express } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRouter';
import commentsRouter from './routes/commentsRouter';
import { errorMiddleware } from './middlewares/errorMiddleware';
import * as dotenv from 'dotenv';
import { ApiError } from './exceptions/apiError';
import serverless from 'serverless-http';

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Express = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors())
app.use('/.netlify/functions/server/api', authRouter);
app.use('/.netlify/functions/server/api', commentsRouter);
app.use(errorMiddleware);

const start = async () => {
  try {
    const { DB_URL } = process.env;

    if (!DB_URL) {
      throw ApiError.NotFound();
    }

    await mongoose.connect(DB_URL);
  } catch (e) {
    console.log(e)
  }
};

start();

export const handler = serverless(app);
