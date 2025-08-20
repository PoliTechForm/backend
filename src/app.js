import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import authRouter from './routes/authRoutes.js';
import userRoute from './routes/userRoutes.js';
import { employeeRoute } from './routes/employeeRoutes.js';
import errorHandler from './middlewares/errorHandler.js';
import { employeeAdminRoute } from './routes/employeeAdminRoutes.js';
import { adminRoute } from './routes/adminRoutes.js';
import { metricRoutes } from './routes/dashboardRoute.js';

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://127.0.0.1:5500",
        "http://localhost:5173",
        "http://192.168.0.154:19000", // Ajusta esta IP
        "http://localhost:19000",
    ],
    credentials: true
}));

app.use(express.json());

app.use('/auth', authRouter);
app.use('/api', userRoute);
//! funciones de administrador
app.use('/admin', adminRoute)
//! funciones de empleado
app.use('/empleado', employeeRoute)
//! funciones conjuntas de empleado y administrador
app.use('/employee-Admin', employeeAdminRoute)
//! Metricas
app.use('/metricas', metricRoutes)

app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});

export default app;
