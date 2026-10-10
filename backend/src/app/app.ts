import express from 'express'
import cors from 'cors'
import routes from "./routes.js"
import helmet from 'helmet'
import cookieParser from "cookie-parser";
import { RateLimit } from '../middlewares/rateLimit.middleware.js'
const app = express()

app.use(express.json({ limit: '100kb', strict: true }))
app.use(cookieParser());
// app.use(RateLimit.limit(100, 15))
app.use(helmet())
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true
}))


app.use('/api', routes)


export default app