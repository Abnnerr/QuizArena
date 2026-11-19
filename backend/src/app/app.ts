import express from 'express'
import cors from 'cors'
import routes from "./routes.js"
import helmet from 'helmet'
import cookieParser from "cookie-parser"
import swaggerUi from "swagger-ui-express";
import { loggerMiddleware } from '../middlewares/logger.middleware.js';
import { swaggerSpec } from '../config/swagger.js'

const app = express()

app.use(express.json({ limit: '100kb', strict: true }))
app.use(loggerMiddleware);
app.use(cookieParser());
// app.use(RateLimit.limit(100, 15))
app.use(helmet())
app.use(cors({
    origin: ["https://quiz-arena-zeta-ten.vercel.app", "http://localhost:5173", "http://localhost:9000"],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
    credentials: true
}))


app.use('/api', routes)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

export default app


