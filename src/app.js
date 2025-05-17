import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin:["http://127.0.0.1:5500", "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

app.use('/api', authRouter);
app.use('/api', userRoute);

app.use(errorHandler);

export default app;
