import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import cookieParser from 'cookie-parser'
const app = express()
app.use(cors({
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