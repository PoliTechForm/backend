import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './routes/authRoutes.js';
import errorHandler from './middlewares/errorHandler.js';  // Middleware global de errores

const app = express();

// Middlewares
app.use(morgan('dev')); // Logger de peticiones HTTP
app.use(helmet());      // Protección contra ataques comunes
app.use(cors());        // Habilitar CORS
app.use(cookieParser()); // Parseo de cookies
app.use(express.json());  // Parseo de JSON en las peticiones

// Rutas de la aplicación
app.use('/api', authRouter);

// Middleware global para manejo de errores
app.use(errorHandler);

export default app;
