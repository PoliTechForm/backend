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
    origin: [
        "http://127.0.0.1:5500", 
        "http://localhost:5173",
        "http://192.168.1.4:19000", // Ajusta esta IP
        "http://localhost:19000"
    ],
    credentials: true
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/api', userRoute);

app.use(errorHandler);

// Escuchar en todas las interfaces de red
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;