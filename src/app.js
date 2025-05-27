import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cors({
<<<<<<< HEAD
   origin: "http://127.0.0.1:5500, http://localhost:5500",
    methods: ["GET", "POST", "PUT", "DELETE"], 
   credentials: true
 }));
app.use(morgan('dev'))
app.use(express.json())
app.use(cookieParser())
app.use(helmet())
app.listen(3000, () => {
    console.log(`Server corriendo en el puerto: PORT🚀`)
})
export default app
=======
    origin: [
        "http://127.0.0.1:5500", 
        "http://localhost:5173",
        "http://          :4000", // Ajusta esta IP, es la misma que el ipv del ipconfig
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
>>>>>>> cedce33a7e97bfbf234d5c7d700d4b9754db6e9b
